import { TInvoiceQueryResp } from '.';

type TBillingQueryResp = {
  id?: number;
  invoices: TInvoiceQueryResp[];
};

export type { TBillingQueryResp };
