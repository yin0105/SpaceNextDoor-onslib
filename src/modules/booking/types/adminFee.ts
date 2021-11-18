import { TaxType } from './tax';

export type TAdminFeeTax = {
  type: TaxType;
  value: number;
};

export type TAdminFee = {
  amount: number;
  tax: TAdminFeeTax;
};

export type TAdminFeePayload = {
  admin_fee_amount: number;
  admin_fee_tax: number;
  has_admin_fee: boolean;
};
