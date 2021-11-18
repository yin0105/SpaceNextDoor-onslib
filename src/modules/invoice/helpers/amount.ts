import { InvoiceFeeType } from '../../../graphql';
import {
  TBillingQueryResp,
  TInvoiceItemQueryResp,
  TInvoiceReceiptQueryResp,
  TInvoiceReceiptItemQueryResp,
} from '../types';

/**
 * Get all
 * @param object billing Renewal data object
 * @returns
 */
export const getInvoices = (billing: TBillingQueryResp) => {
  const { invoices = [] } = billing;
  return invoices.filter(invoice => invoice.status !== 'VOICED');
};

export const getInvoiceItems = (
  billing: TBillingQueryResp
): TInvoiceItemQueryResp[] =>
  getInvoices(billing).reduce((acc, cur) => {
    const { invoice_items: invoiceItems = [], ...rest } = cur;
    return acc.concat(invoiceItems.map(item => ({ ...item, invoice: rest })));
  }, [] as TInvoiceItemQueryResp[]);

export const getReceipts = (
  billing: TBillingQueryResp
): TInvoiceReceiptQueryResp[] =>
  getInvoices(billing).reduce((acc, cur) => {
    const { invoice_receipts: invoiceReceipts = [] } = cur;
    return acc.concat(invoiceReceipts);
  }, [] as TInvoiceReceiptQueryResp[]);

export const getReceiptItems = (billing: TBillingQueryResp) =>
  getReceipts(billing).reduce((acc, cur) => {
    const { invoice_receipt_items: receiptITems = [] } = cur;
    return acc.concat(receiptITems);
  }, [] as TInvoiceReceiptItemQueryResp[]);

export const getTotalAmount = (
  billing: TBillingQueryResp,
  type?: InvoiceFeeType
) =>
  getInvoices(billing).reduce((acc, cur) => {
    let { invoice_items: invoiceItems = [] } = cur;

    if (type) {
      invoiceItems = invoiceItems.filter(invoice => invoice.type === type);
    }

    return (
      acc +
      invoiceItems.reduce((acc2, cur2) => acc2 + (cur2?.total_amount || 0), 0)
    );
  }, 0);

export const getSubTotalAmount = (
  billing: TBillingQueryResp,
  type?: InvoiceFeeType
) =>
  getInvoices(billing).reduce((acc, cur) => {
    let { invoice_items: invoiceItems = [] } = cur;

    if (type) {
      invoiceItems = invoiceItems.filter(invoice => invoice.type === type);
    }
    return (
      acc +
      invoiceItems.reduce((acc2, cur2) => acc2 + (cur2.total_amount || 0), 0)
    );
  }, 0);

export const getPaidAmount = (
  billing: TBillingQueryResp,
  type?: InvoiceFeeType
) => {
  const receipts = getReceipts(billing);
  return receipts.reduce((acc, cur) => {
    let { invoice_receipt_items: receiptItems = [] } = cur;

    if (type) {
      receiptItems = receiptItems.filter(item => item.type === type);
    }

    return (
      acc + receiptItems.reduce((acc2, cur2) => acc2 + (cur2.amount || 0), 0)
    );
  }, 0);
};

export const getPendingAmount = (
  billing: TBillingQueryResp,
  type?: InvoiceFeeType
) => getTotalAmount(billing, type) - getPaidAmount(billing, type);

export const getRefundAmount = (
  billing: TBillingQueryResp,
  type?: InvoiceFeeType
) =>
  getInvoices(billing).reduce((acc, cur) => {
    const { refund_receipts: refundReceipts = [] } = cur;
    return refundReceipts.reduce((acc2, cur2) => {
      let { refunds = [] } = cur2;

      if (type) {
        refunds = refunds.filter(
          item => (item.type as unknown as InvoiceFeeType) === type
        );
      }

      return refunds.reduce((acc3, cur3) => acc3 + (cur3.amount || 0), acc2);
    }, acc);
  }, 0);
