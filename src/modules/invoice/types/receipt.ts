import { InvoiceFeeType, InvoiceReceiptStatus } from '../../../graphql';
import { TInvoiceReceiptTransactionPayload } from '../../transaction';
import {
  TInvoiceBookingDataResp,
  TInvoiceDataResp,
  TInvoiceRenewalDataResp,
} from './invoice';

type TInvoiceReceiptItemPayload = {
  invoice_receipt_id?: number;
  type: InvoiceFeeType;
  description?: string;
  amount: number;
  payment_method_id?: number;
  transaction_reference?: string;
  transaction_memo?: string;
  transaction?: {
    data: TInvoiceReceiptTransactionPayload;
  };
};

type TInvoiceReceiptFunctionPayload = {
  invoice_id: number;
  renewal_id: number;
  receipt_memo?: string;
  paid_date?: Date;
  cashier_name?: string;
  items: TInvoiceReceiptItemPayload[];
};

type TInvoiceReceiptDataResp = {
  id: number;
  renewal: TInvoiceRenewalDataResp;
  booking: TInvoiceBookingDataResp;
  status: InvoiceReceiptStatus;
  amount: number;
};

type TInvoiceReceiptPayload = {
  invoice_id: number;
  transaction_id?: number;
  renewal_id: number;
  booking_id: number;
  paid_date: Date;
  cashier_name?: string;
  memo?: string;
  status?: InvoiceReceiptStatus;
  invoice_receipt_items: {
    data: TInvoiceReceiptItemPayload[];
  };
};

type TInvoiceReceiptRawPayload = TInvoiceDataResp & {
  renewal: TInvoiceRenewalDataResp;
  booking: TInvoiceBookingDataResp;
  status: InvoiceReceiptStatus;
  paid_date?: Date;
  cashier_name?: string;
  receipt_memo?: string;
  receipt_items: TInvoiceReceiptItemPayload[];
};
type TInvoiceReceiptItemQueryResp = {
  id?: number;
  type?: InvoiceFeeType;
  amount?: number;
};

type TInvoiceReceiptItemAggregation = {
  aggregate?: {
    sum?: {
      amount?: number;
    };
  };
};

type TInvoiceReceiptQueryResp = {
  id?: number;
  paid_date?: Date;
  invoice_receipt_items_aggregate?: TInvoiceReceiptItemAggregation;
  invoice_receipt_items?: TInvoiceReceiptItemQueryResp[];
};
export {
  TInvoiceReceiptPayload,
  TInvoiceReceiptDataResp,
  TInvoiceReceiptRawPayload,
  TInvoiceReceiptItemPayload,
  TInvoiceReceiptFunctionPayload,
  TInvoiceReceiptQueryResp,
  TInvoiceReceiptItemQueryResp,
  TInvoiceReceiptItemAggregation,
};
