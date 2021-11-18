/**
 * --------------------------------------------------------------------------------
 * ONLY ADD HELPER METHODS HERE WHICH ARE BEING USE AS IT IS IN MULTIPLE FUNCTIONS
 * --------------------------------------------------------------------------------
 */
const dayjs = require('dayjs');

import {
  IBooking,
  IBookingPromotion,
  IRenewal,
  ICalculateTerminationDuesResp,
} from '../modules/booking/interfaces';
import { BadRequestError, NotFoundError } from '../exceptions';
import {
  BookingStatus,
  PromotionBuyTypes,
  PromotionFormat,
  RenewalStatus,
} from '../graphql/enums';

const TERMINATION_NOTICE_DAYS = 14;

/**
 * [START] Termination Related helper methods
 */

export const calculateTermination = (
  booking: IBooking,
  promotion: IBookingPromotion,
  renewals: IRenewal[],
  move_out_date: Date,
  use_move_out_date: boolean = false,
  exclude_notice_dues: boolean = false
): ICalculateTerminationDuesResp => {
  const currentDate = dayjs();
  const requestMoveOutDate = dayjs(move_out_date);

  // limit the request termination frame-time up to 1 month
  if (requestMoveOutDate.isAfter(currentDate.add(1, 'month'))) {
    console.error('Please chose move out date within 1 month');

    throw new BadRequestError('Please chose move out date within 1 month');
  }

  // minimum notice period
  let terminationDate = dayjs().add(TERMINATION_NOTICE_DAYS, 'days');

  //
  if (use_move_out_date || requestMoveOutDate > terminationDate) {
    terminationDate = requestMoveOutDate;
  }

  console.log('currentDate;', currentDate);
  console.log('requestMoveOutDate: ', requestMoveOutDate);

  // use need to chose move out from tomorrow
  if (requestMoveOutDate.isBefore(currentDate.add(1, 'day'), 'day')) {
    console.error('Move out date should be after today');

    throw new BadRequestError('Move out date should be after today');
  }

  //
  if (
    booking.status !== BookingStatus.ACTIVE &&
    booking.status !== BookingStatus.CONFIRMED
  ) {
    throw new NotFoundError('Booking is not active');
  }

  if (dayjs(booking.move_in_date).isAfter(currentDate)) {
    throw new NotFoundError('Booking should be cancel instead of termination');
  }

  // If promo was applied then user need to clear up the promotion dues if did not meet commitment months
  const { amount: promoAmount, removedDiscount } = calculatePromotionDues(
    move_out_date,
    promotion,
    booking,
    renewals
  );

  // Scenario:
  // Booking have move out day AND the user wants to terminate before of that date.
  // Then, customer needs to pay at least 14 days (due to termination policy.)
  // nextDaysToBeCharged: from today to move out date, we'll not count these in remainingDaysAmountBeforeToday
  let nextDaysToBeCharged = requestMoveOutDate.diff(currentDate, 'days') + 1;
  if (nextDaysToBeCharged < TERMINATION_NOTICE_DAYS) {
    nextDaysToBeCharged = TERMINATION_NOTICE_DAYS;
  }

  // noticePeriodAmount from today onwards
  let noticePeriodAmount = parseFloat(
    ((booking.base_amount / 30) * nextDaysToBeCharged).toFixed(2)
  );

  if (exclude_notice_dues) {
    noticePeriodAmount = 0;
  }

  // calculate failed renewals amount and remaining days amount which is not paid yet
  const { failedRenewalsAmount, remainingDaysAmountBeforeToday } =
    calculateFailedRenewalAmount(currentDate, removedDiscount, renewals);

  const totalAmount = parseFloat(
    (
      noticePeriodAmount +
      promoAmount +
      failedRenewalsAmount +
      remainingDaysAmountBeforeToday
    ).toFixed(2)
  );

  return {
    currency: booking.currency?.code,
    currency_sign: booking.currency?.sign,
    move_out_date: requestMoveOutDate.toDate(),
    termination_date: terminationDate.toDate(),
    failed_renewals_amount: failedRenewalsAmount,
    notice_period_amount: noticePeriodAmount,
    promotion_amount: promoAmount,
    remaining_days_amount: remainingDaysAmountBeforeToday,
    total_amount: totalAmount,
  };
};

/**
 * If the promotion was applied and customer didn't stayed for the committed months,
 * Then we need to charge customer 100% of what was given discount for the promotions
 */
export const calculatePromotionDues = (
  moveOutDate: Date,
  promotion: IBookingPromotion,
  booking: IBooking,
  renewals: IRenewal[]
): { amount: number; removedDiscount: boolean } => {
  const moveOutDiffMonths = dayjs(booking.created_at).diff(
    moveOutDate,
    'months'
  );

  let promotionDiscount = 0;
  let removedDiscount = false;
  if (
    !!promotion &&
    promotion.format === PromotionFormat.PUBLIC &&
    promotion.bookings_promotions_customer_buys[0]?.type ===
      PromotionBuyTypes.MIN_DAYS &&
    moveOutDiffMonths <
      promotion.bookings_promotions_customer_buys[0]?.value / 30
  ) {
    removedDiscount = true;
    renewals.forEach(renewal => {
      if (renewal.status === RenewalStatus.PAID) {
        promotionDiscount += renewal.discount_amount;
      }
    });
  }

  return {
    removedDiscount,
    amount: parseFloat(promotionDiscount.toFixed(2)),
  };
};

/**
 * This would return amount of UNPAID renewals in two parts
 * 1. failedRenewalsAmount - Which is full months' unpaid amount
 * 2. remainingDaysAmount - remaining days amount
 */
export const calculateFailedRenewalAmount = (
  currentDate: typeof dayjs,
  payDiscountedAmount: boolean, // mean we need to charge(given discount as well) if promotion was given
  renewals: IRenewal[]
): { failedRenewalsAmount: number; remainingDaysAmountBeforeToday: number } => {
  let failedRenewalsAmount = 0;

  // calculate remaining days amount which is not paid yet
  let remainingDaysAmountBeforeToday = 0;

  renewals.forEach(renewal => {
    // renewal.renewal_end_date <= currentDate
    // MEANS we only get FULL LAST MONTHS UNPAID renewals BEFORE TODAY,
    const renewalStartDate = dayjs(renewal.renewal_start_date);
    const renewalEndDate = dayjs(renewal.renewal_end_date);
    if (renewal.status !== RenewalStatus.PAID) {
      if (renewalEndDate.isBefore(currentDate)) {
        failedRenewalsAmount += renewal.total_amount;
        if (payDiscountedAmount) {
          failedRenewalsAmount += renewal.discount_amount;
        }
      }

      if (
        renewalStartDate.isBefore(currentDate) &&
        renewalEndDate.isAfter(currentDate)
      ) {
        const remainingDays = currentDate.diff(renewalStartDate, 'days');
        let renewalTotalAmount = renewal.total_amount;
        if (payDiscountedAmount) {
          renewalTotalAmount += renewal.discount_amount;
        }

        remainingDaysAmountBeforeToday = parseFloat(
          ((renewalTotalAmount / 30) * remainingDays).toFixed(2)
        );

        if (remainingDaysAmountBeforeToday < 0) {
          remainingDaysAmountBeforeToday = 0;
        }
      }
    }
  });

  return {
    failedRenewalsAmount: parseFloat(failedRenewalsAmount.toFixed(2)),
    remainingDaysAmountBeforeToday: parseFloat(
      remainingDaysAmountBeforeToday.toFixed(2)
    ),
  };
};

/**
 * [END] Termination Related helper methods
 */
