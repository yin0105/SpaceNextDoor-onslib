import { DAY_PER_MONTH } from '../../../configs';
import {
  PromotionFormat,
  PromotionBuyTypes,
  PromotionForType,
  PromotionType,
  RenewalStatus,
  RenewalType,
} from '../../../graphql/enums';
import { getPromotions } from '../requests';
import { getTaxes } from '../requests/tax';
import { TRenewalPayload, TTaxApplied } from '../types';
import { calculatePrepayMonth } from './utils';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const dayJSTimezone = require('dayjs/plugin/timezone');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(utc);
dayjs.extend(dayJSTimezone);
dayjs.extend(advancedFormat);

export async function getTotalAmounts(params: {
  price: number;
  insurancePricePerMonth: number;
  isPrepaid: boolean;
  prepaidMonths: number;
  moveInDate: Date;
  moveOutDate?: Date;
}): Promise<{
  insuranceAmount: number;
  subTotalAmount: number;
  depositAmount: number;
}> {
  const {
    price,
    insurancePricePerMonth,
    isPrepaid = false,
    moveInDate,
    moveOutDate,
    prepaidMonths = 1,
  } = params;

  const { insuranceAmount, subTotalAmount, depositedAmount } = getPrepayAmounts(
    {
      moveInDate,
      moveOutDate,
      pricePerMonth: price,
      baseAmountDiscounted: price,
      insurancePricePerMonth,
      prepaidMonths,
      isPrepaid,
    }
  );

  return {
    insuranceAmount: parseFloat(insuranceAmount.toFixed(2)),
    subTotalAmount: parseFloat(subTotalAmount.toFixed(2)),
    depositAmount: parseFloat(depositedAmount.toFixed(2)),
  };
}

export async function getRenewalPayload(params: {
  insuranceAmount: number;
  depositAmount: number;
  adminFeeAmount: number;
  moveInDate: Date;
  baseAmount: number;
  baseAmountDiscounted: number; // can be after discount
  discountedAmount: number;
  status: RenewalStatus;
  type: RenewalType;
  isPrepaid: boolean;
  prepaidMonths?: number;
  moveOutDate?: Date;
  insuranceId?: number;
}): Promise<TRenewalPayload> {
  const {
    insuranceAmount,
    depositAmount,
    adminFeeAmount,
    moveInDate,
    moveOutDate,
    baseAmount,
    baseAmountDiscounted,
    discountedAmount,
    status,
    type,
    isPrepaid,
    prepaidMonths,
    insuranceId,
  } = params;

  const { renewalAmount, nextRenewalDate, renewalEndDate } = getPrepayAmounts({
    moveInDate,
    moveOutDate,
    pricePerMonth: baseAmount,
    baseAmountDiscounted,
    insurancePricePerMonth: insuranceAmount,
    prepaidMonths,
    isPrepaid,
  });

  const discountedAmountFloated = parseFloat(discountedAmount.toFixed(2));
  const subTotalAmount = parseFloat(renewalAmount.toFixed(2));
  const totalAmount = parseFloat(
    (
      subTotalAmount +
      depositAmount +
      adminFeeAmount +
      insuranceAmount -
      discountedAmountFloated
    ).toFixed(2)
  );

  return {
    next_renewal_date: nextRenewalDate,
    deposit_amount: depositAmount,
    status,
    type,
    base_amount: parseFloat(baseAmount.toFixed(2)),
    total_amount: totalAmount,
    sub_total_amount: subTotalAmount,
    discount_amount: discountedAmountFloated,
    renewal_start_date: moveInDate,
    renewal_end_date: renewalEndDate,
    insurance_id: insuranceId || null,
    insurance_amount: insuranceAmount,
  };
}

export async function getPromotionAmount(params: {
  pricePerMonth: number; // space amount
  moveInDate: Date;
  moveOutDate: string | Date;
  voucherCode: string; // private/voucher promotions
  promotionId: number;
  isPrepaid: boolean;
  prepaidMonths: number;
}): Promise<any> {
  const {
    pricePerMonth,
    moveInDate,
    moveOutDate,
    voucherCode,
    promotionId,
    isPrepaid,
    prepaidMonths,
  } = params;

  let commitMonths = 0;
  const generalResponse = {
    promotion: null,
    public_promotion: null,
    price_per_month: pricePerMonth,
    discounted_amount: 0,
    total: pricePerMonth,
    total_after_discount: pricePerMonth,
    min_commitment_months: commitMonths,
  };

  if (!voucherCode && !promotionId) {
    return generalResponse;
  }

  let commitDays = DAY_PER_MONTH; // 1 month
  if (moveOutDate) {
    const date1 = dayjs.utc(moveInDate);
    const date2 = dayjs.utc(moveOutDate);
    commitDays = date2.diff(date1, 'days') + 1;
    commitMonths = date2.diff(date1, 'months');
  }

  let amount = pricePerMonth;
  if (commitMonths < 1) {
    amount = (pricePerMonth / DAY_PER_MONTH) * commitDays;
  }
  amount = parseFloat(amount.toFixed(2));

  const promotions = await getPromotions(promotionId, voucherCode);

  if (!promotions.length) {
    return generalResponse;
  }

  let promo = null;
  let publicPromotion = null;
  let discountedAmount = 0;
  let promoWillApplyOnRenewal: number | undefined = undefined; // if will apply in future renewals
  for (const promotion of promotions) {
    if (
      !promotion.promotions_customer_buys.length ||
      !promotion.promotions_customer_gets.length ||
      (!!promotion.max && promotion.promotions_redeems.length >= promotion.max)
    ) {
      continue;
    }

    const customerBuys = promotion.promotions_customer_buys[0];
    const customerGets = promotion.promotions_customer_gets;
    const customerBuysInMonths = customerBuys.value / DAY_PER_MONTH;

    // check if customer meets the criteria of what customer buys
    let buyCheckPassed = false;
    let isPromoApplied = false;
    if (customerBuys.type === PromotionBuyTypes.MIN_DAYS) {
      if (!moveOutDate) {
        buyCheckPassed = true;
      } else if (
        customerBuys.value < DAY_PER_MONTH &&
        commitDays >= customerBuys.value
      ) {
        buyCheckPassed = true;
      } else if (
        customerBuys.value >= DAY_PER_MONTH &&
        commitMonths >= customerBuysInMonths
      ) {
        buyCheckPassed = true;
      }
    } else if (
      customerBuys.type === PromotionBuyTypes.MIN_PRICE &&
      amount >= customerBuys.value
    ) {
      buyCheckPassed = true;
    }

    if (buyCheckPassed) {
      const totalMonth = calculatePrepayMonth({
        isPrepaid,
        moveInDate,
        moveOutDate,
        prepaidMonths,
      });
      for (let forMonth = 1; forMonth <= totalMonth; forMonth++) {
        customerGets.forEach((gets: any) => {
          let applyPromo = false;
          if (
            gets.for_type === PromotionForType.FIRST_MONTHS &&
            forMonth <= gets.for_value
          ) {
            applyPromo = true;
          } else if (gets.for_type === PromotionForType.RENEWAL_INDEX) {
            if (gets.for_value === forMonth) {
              applyPromo = true;
            } else {
              promoWillApplyOnRenewal = promotion.id;
            }
          }

          if (applyPromo) {
            isPromoApplied = true;
            //
            if (promotion.format === PromotionFormat.PUBLIC) {
              publicPromotion = promotion;
            } else {
              promo = promotion;
            }

            switch (gets.type) {
              case PromotionType.FIXED_AMOUNT_DISCOUNT:
                discountedAmount += gets.value;
                break;
              case PromotionType.PERCENTAGE_DISCOUNT:
                discountedAmount += (amount * gets.value) / 100;
                break;
              case PromotionType.TOTAL_AMOUNT:
                discountedAmount += amount - gets.value;
            }

            //
            if (gets.max_amount_per_booking) {
              discountedAmount =
                discountedAmount > gets.max_amount_per_booking
                  ? gets.max_amount_per_booking
                  : discountedAmount;
            }

            //
            discountedAmount = parseFloat(discountedAmount.toFixed(2));
          }
          //
          if (
            !moveOutDate &&
            customerBuys.type === PromotionBuyTypes.MIN_DAYS
          ) {
            commitMonths = parseFloat(
              (customerBuys.value / DAY_PER_MONTH).toFixed(1)
            );
          }

          if (promotion.format === PromotionFormat.PUBLIC) {
            publicPromotion =
              isPromoApplied || promoWillApplyOnRenewal ? promotion : null;
          } else {
            promo = isPromoApplied ? promotion : null;
          }
        });
      }
    } else {
      if (promotion.format === PromotionFormat.PUBLIC) {
        publicPromotion = null;
      } else {
        promo = null;
      }
    }
  }

  if (!promo && !publicPromotion && !promoWillApplyOnRenewal) {
    return generalResponse;
  }

  if (isPrepaid) {
    amount = parseFloat((amount * prepaidMonths).toFixed(2));
  }

  // if both promotion were applied and discounted amount goes to negative
  // make it zero then
  discountedAmount = Math.max(discountedAmount, 0);
  return {
    promotion: promo ? (promo as undefined) : null,
    public_promotion: publicPromotion ? (publicPromotion as undefined) : null,
    price_per_month: pricePerMonth,
    total: amount,
    discounted_amount: discountedAmount,
    total_after_discount: parseFloat((amount - discountedAmount).toFixed(2)),
    min_commitment_months: commitMonths,
    applied_public_promotion_id: promoWillApplyOnRenewal,
  };
}

export const getTaxAmount = async (params: {
  subTotalAmount: number;
  discountAmount: number;
  insuranceAmount: number;
  buildingId: number;
  companyId: number;
  bookingId?: number;
  renewalId?: number;
  isInsured: boolean;
}): Promise<{
  totalRentTaxAmount: number;
  totalInsuranceTaxAmount: number;
  taxesApplied: TTaxApplied[];
}> => {
  const {
    subTotalAmount,
    discountAmount,
    insuranceAmount,
    buildingId,
    companyId,
    isInsured,
    bookingId,
    renewalId,
  } = params;
  const taxesApplied: TTaxApplied[] = [];
  const taxableAmount = subTotalAmount - discountAmount;
  let totalRentTaxAmount = 0;
  let totalInsuranceTaxAmount = 0;

  const taxes = await getTaxes(buildingId, companyId);
  taxes.building_taxes.forEach((tax: any) => {
    let taxAmount = 0;
    if (tax.type === 'PERCENTAGE') {
      taxAmount = taxableAmount * (tax.value / 100);
    } else {
      taxAmount = tax.value;
    }
    totalRentTaxAmount += taxAmount;

    // Prepare data to applied the tax for the reservation
    if (bookingId && renewalId) {
      taxesApplied.push({
        building_tax_id: tax.id,
        name_en: tax.name_en,
        name_th: tax.name_th,
        currency_id: tax.currency_id,
        type: tax.type,
        value: tax.value,
        tax_amount: taxAmount,
        booking_id: bookingId,
        renewal_id: renewalId,
      });
    }
  });

  if (isInsured) {
    taxes.insurance_taxes.forEach((tax: any) => {
      let taxAmount = 0;
      if (tax.type === 'PERCENTAGE') {
        taxAmount = insuranceAmount * (tax.value / 100);
      } else {
        taxAmount = tax.value;
      }
      totalInsuranceTaxAmount += taxAmount;

      // Prepare data to applied the tax for the reservation
      if (bookingId && renewalId) {
        taxesApplied.push({
          insurance_tax_id: tax.id,
          name_en: tax.name_en,
          name_th: tax.name_th,
          currency_id: tax.currency_id,
          type: tax.type,
          value: tax.value,
          tax_amount: taxAmount,
          booking_id: bookingId,
          renewal_id: renewalId,
        });
      }
    });
  }

  return {
    totalRentTaxAmount,
    totalInsuranceTaxAmount,
    taxesApplied,
  };
};

export const getPrepayAmounts = (params: {
  moveInDate: Date | string; // move in date
  moveOutDate?: Date | string; // move out date
  pricePerMonth: number; // unit subtype price per month
  baseAmountDiscounted: number; // after discounted
  insurancePricePerMonth: number;
  isPrepaid?: boolean;
  prepaidMonths?: number;
}): {
  renewalAmount: number;
  depositedAmount: number;
  insuranceAmount: number;
  subTotalAmount: number;
  renewalEndDate: Date;
  nextRenewalDate: Date;
} => {
  const {
    moveInDate,
    moveOutDate,
    pricePerMonth,
    prepaidMonths = 1,
    isPrepaid = false,
    baseAmountDiscounted,
    insurancePricePerMonth,
  } = params;
  const totalMonth = calculatePrepayMonth({
    isPrepaid,
    moveInDate,
    moveOutDate,
    prepaidMonths,
  });
  let renewalAmount = pricePerMonth;
  let nextRenewalDate = null;
  let renewalEndDate = dayjs.utc(moveInDate).add(totalMonth, 'month');
  const parsedMoveInDate = dayjs.utc(moveInDate);
  const parsedMoveOutDate = dayjs.utc(moveOutDate);
  let depositedAmount: number = pricePerMonth;
  let subTotalAmount: number = pricePerMonth;
  let insuranceAmount: number = insurancePricePerMonth;

  // Calculate days between move in date and move out date.
  const differenceInDays = parsedMoveOutDate.diff(parsedMoveInDate, 'day') + 1;

  // If days between move in date and move out date is less
  // then 30 then calculate deposited amount based on only those days.
  if (differenceInDays <= DAY_PER_MONTH && moveOutDate) {
    renewalEndDate = moveOutDate ? parsedMoveOutDate : renewalEndDate;
    renewalAmount = (baseAmountDiscounted / DAY_PER_MONTH) * differenceInDays;

    // Rent and insurance amount
    depositedAmount = (pricePerMonth / DAY_PER_MONTH) * differenceInDays;
    subTotalAmount = (pricePerMonth / DAY_PER_MONTH) * differenceInDays;
  } else {
    // Calculate the next renewal date if the move out date over one month
    nextRenewalDate = dayjs
      .utc(moveInDate)
      .add(totalMonth, 'months')
      .subtract(2, 'day');
  }

  if (isPrepaid) {
    renewalAmount = renewalAmount * totalMonth;
    insuranceAmount = insuranceAmount * totalMonth;
    subTotalAmount = subTotalAmount * totalMonth;
  }

  return {
    renewalAmount,
    nextRenewalDate,
    renewalEndDate,
    depositedAmount,
    insuranceAmount,
    subTotalAmount,
  };
};
