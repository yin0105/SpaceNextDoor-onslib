import {
  InvoiceFeeType,
  InvoiceWaivingFeeStatus,
} from '../../../graphql/enums';

export type TWaivingFeeItemPayload = {
  invoice_waived_fee_id?: number;
  type: InvoiceFeeType;
  amount: number;
  description?: String;
  status?: InvoiceWaivingFeeStatus;
};

export type TWaivingFeeFunctionPayload = {
  invoice_id: number;
  memo?: string;
  waiving_date?: Date;
  items: TWaivingFeeItemPayload[];
};

export type TInvoiceWaivingFeePayload = {
  invoice_id: number;
  renewal_id: number;
  booking_id: number;
  waived_date: Date;
  memo?: string;
  created_by: number;
  updated_by?: number;
  invoice_waived_fee_items: {
    data: TWaivingFeeItemPayload[];
  };
};
