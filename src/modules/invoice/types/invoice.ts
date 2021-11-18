import { TInvoiceReceiptQueryResp, TRefundReceiptQueryResp } from '.';
import {
  InvoiceStatus,
  InvoiceFeeType,
  InvoiceReceiptStatus,
} from '../../../graphql/enums';

type TInvoiceItemPayload = {
  invoice_id?: number;
  type: InvoiceFeeType;
  qty: number;
  description?: string;
  sub_total_amount: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
};

type TInvoicePayload = {
  start_date: Date /* Rental period start date */;
  end_date: Date /* Rental period end date */;
  renewal_id: number;
  booking_id: number;
  currency_id: number;
  issued_date: Date;
  due_date: Date;
  memo?: string;
  status?: InvoiceStatus;
  invoice_items: {
    data: TInvoiceItemPayload[];
  };
};

type TInvoiceRequestPayload = {
  renewal_id: number;
  memo?: string;
  invoice_items: TInvoiceItemRequestPayload[];
};

type TInvoiceItemRequestPayload = {
  type: InvoiceFeeType;
  qty?: number;
  description?: string;
  sub_total_amount: number;
  discount_amount?: number;
  tax_amount?: number;
};

type TInvoiceBookingDataResp = {
  id: number;
  currency_id: number;
  customer_id: number;
  building_id?: number;
  unit_id?: number;
  unit_subtype_id?: number;
  company_id?: number;
};

type TInvoiceRenewalDataResp = {
  id: number;
};

type TInvoiceDataResp = {
  id: number;
  renewal: TInvoiceRenewalDataResp;
  booking: TInvoiceBookingDataResp;
  status: InvoiceReceiptStatus;
  sub_total_amount?: number;
  tax_amount?: number;
  total_amount: number;
};

type TInvoiceItemQueryResp = {
  id?: number;
  type?: InvoiceFeeType;
  sub_total_amount?: number;
  tax_amount?: number;
  discount_amount?: number;
  total_amount?: number;
};

type TInvoiceItemAggregation = {
  aggregate?: {
    sum?: {
      total_amount?: number;
    };
  };
};

type TInvoiceQueryResp = {
  id?: number;
  status?: InvoiceStatus;
  due_date?: Date;
  invoice_items: TInvoiceItemQueryResp[];
  invoice_items_aggregate?: TInvoiceItemAggregation;
  invoice_receipts?: TInvoiceReceiptQueryResp[];
  refund_receipts?: TRefundReceiptQueryResp[];
};

export type {
  TInvoiceItemPayload,
  TInvoicePayload,
  TInvoiceRequestPayload,
  TInvoiceItemRequestPayload,
  TInvoiceDataResp,
  TInvoiceRenewalDataResp,
  TInvoiceBookingDataResp,
  TInvoiceQueryResp,
  TInvoiceItemQueryResp,
  TInvoiceItemAggregation,
};
