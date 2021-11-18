import { InvoiceFeeType, InvoiceStatus } from '../../../graphql';
import {
  TInvoiceItemRequestPayload,
  TInvoicePayload,
  TInvoiceItemPayload,
} from '../types';
import {
  TRenewalQueryResp,
  TCreateBookingRenewalResp,
} from '../../booking/types';
import { isDate } from 'lodash';

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const dayJSTimezone = require('dayjs/plugin/timezone');
const advancedFormat = require('dayjs/plugin/advancedFormat');
dayjs.extend(utc);
dayjs.extend(dayJSTimezone);
dayjs.extend(advancedFormat);

/**
 * Prepare payload to create a new invoice.
 *
 * @param renewal Renewal object which is returned after creating a booking.
 * @param prepaidMonths Prepay months which user selects on FE.
 * @returns
 */
export const generateInvoiceItems = (
  renewal: TCreateBookingRenewalResp,
  prepaidMonths: number = 1,
  withDeposit: boolean = false
): TInvoiceItemRequestPayload[] => {
  const {
    deposit_amount: depositAmount,
    insurance_amount: insuranceAmount,
    discount_amount: discountAmount,
    sub_total_amount: subTotalAmount,
    admin_fee_amount: adminFeeAmount,
    admin_fee_tax: adminFeeTax,
    total_rent_tax_amount: totalRentTaxAmount,
    total_insurance_tax_amount: totalInsuranceTaxAmount,
    renewal_start_date: renewalStartDate,
    renewal_end_date: renewalEndDate,
  } = renewal;

  const invoiceItems: TInvoiceItemRequestPayload[] = [];

  let diffDays = 0;
  let totalMonth = prepaidMonths > 0 ? prepaidMonths : 1;
  let descriptionDate = '';
  let descriptionQty = '';
  if (renewalStartDate) {
    const startDate = isDate(renewalStartDate)
      ? renewalStartDate
      : dayjs.utc(renewalStartDate);
    let endDate = startDate.add(prepaidMonths, 'month');

    if (renewalEndDate) {
      endDate = isDate(renewalEndDate)
        ? renewalEndDate
        : dayjs.utc(renewalEndDate);
      diffDays = endDate.diff(startDate, 'day');
      totalMonth = endDate.diff(startDate, 'month');
      if (totalMonth < 1) {
        descriptionQty = `(${diffDays} ${diffDays > 1 ? 'days' : 'day'}) `;
      } else {
        descriptionQty = `(${totalMonth} ${
          totalMonth > 1 ? 'months' : 'month'
        }) `;
      }
    }
    descriptionDate = `${descriptionQty}${startDate.format(
      'DD/MM/YYYY'
    )}-${endDate.format('DD/MM/YYYY')}`;
  }

  if (withDeposit) {
    invoiceItems.push({
      type: InvoiceFeeType.DEPOSIT,
      sub_total_amount: depositAmount,
      discount_amount: 0,
      tax_amount: 0,
      qty: 1,
      description: `Security Deposit`,
    });
  }

  return invoiceItems.concat([
    {
      type: InvoiceFeeType.ADMIN_FEE,
      sub_total_amount: adminFeeAmount,
      discount_amount: 0,
      tax_amount: adminFeeTax,
      qty: 1,
      description: `Admin Fee`,
    },
    {
      type: InvoiceFeeType.RENT,
      sub_total_amount: subTotalAmount,
      discount_amount: discountAmount,
      tax_amount: totalRentTaxAmount,
      qty: prepaidMonths,
      description: `Storage Fee ${descriptionDate}`,
    },
    {
      type: InvoiceFeeType.INSURANCE,
      sub_total_amount: insuranceAmount,
      discount_amount: 0,
      tax_amount: totalInsuranceTaxAmount,
      qty: prepaidMonths,
      description: `Insurance Fee ${descriptionDate}`,
    },
  ]);
};

export const prepareInvoicePayload = (
  renewal: TRenewalQueryResp,
  invoiceItems: TInvoiceItemRequestPayload[],
  memo: string = ''
): TInvoicePayload => {
  const { renewal_start_date: startDate, renewal_end_date: endDate } = renewal;

  const invoiceItemPayload: TInvoiceItemPayload[] = invoiceItems.map(item => {
    const {
      sub_total_amount: subTotalAmount = 0,
      discount_amount: discountAmount = 0,
      tax_amount: taxAmount = 0,
      description = '',
      type,
    } = item;

    if (
      item.type === InvoiceFeeType.RENT &&
      subTotalAmount > renewal.sub_total_amount
    ) {
      throw Error('Invalid storage rental amount');
    }

    if (
      item.type === InvoiceFeeType.INSURANCE &&
      subTotalAmount > renewal.insurance_amount
    ) {
      throw Error('Invalid insurance amount');
    }

    if (
      item.type === InvoiceFeeType.DEPOSIT &&
      subTotalAmount > renewal.deposit_amount
    ) {
      throw Error('Invalid deposit amount');
    }

    if (
      item.type === InvoiceFeeType.ADMIN_FEE &&
      subTotalAmount > renewal.admin_fee_amount
    ) {
      throw Error('Invalid admin fee amount');
    }

    const qty = item.qty || 1;
    const totalAmount = subTotalAmount + taxAmount - discountAmount;

    return {
      type,
      description,
      sub_total_amount: +subTotalAmount,
      discount_amount: +discountAmount,
      tax_amount: +taxAmount,
      qty,
      total_amount: +totalAmount,
    };
  });

  // Prepare invoice payload.
  const { INVOICE_DUE_DAY_PERIOD = 5 } = process.env;
  const issuedDate = dayjs.utc().toDate();
  const dueDate = dayjs
    .utc(issuedDate)
    .add(+INVOICE_DUE_DAY_PERIOD, 'day')
    .toDate();

  return {
    start_date: startDate,
    end_date: endDate,
    renewal_id: renewal.id,
    booking_id: renewal.booking.id,
    currency_id: renewal.booking.currency_id,
    issued_date: issuedDate,
    due_date: dueDate,
    status: InvoiceStatus.INVOICED,
    memo,
    invoice_items: {
      data: invoiceItemPayload,
    },
  };
};
