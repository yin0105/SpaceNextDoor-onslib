import { TransactionType, TransactionStatus } from '../../../graphql';

type TInvoiceReceiptTransactionPayload = {
  type: TransactionType;
  amount: number;
  payment_method_id: number;
  booking_id: number;
  currency_id: number;
  invoice_receipt_id?: number;
  customer_id: number;
  transaction_reference?: string;
  memo?: string;
  status: TransactionStatus;
};

export type { TInvoiceReceiptTransactionPayload };
