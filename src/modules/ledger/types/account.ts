import { TPaymentMethodQueryResp } from '.';

export type IAccountCodes = {
  code: number;
  path: string;
};

export enum LedgerTransactionType {
  PAYMENT_RENT = 'PAYMENT_RENT',
  PAYMENT_DEPOSIT = 'PAYMENT_DEPOSIT',
  PAYMENT_INSURANCE = 'PAYMENT_INSURANCE',
  PAYMENT_ADMIN_FEE = 'PAYMENT_ADMIN_FEE',
  WAIVING_DEPOSIT = 'WAIVING_DEPOSIT',
  WAIVING_RENT = 'WAIVING_RENT',
  WAIVING_INSURANCE = 'WAIVING_INSURANCE',
  WAIVING_ADMIN_FEE = 'WAIVING_ADMIN_FEE',
  WAIVING_LATE_FEE = 'WAIVING_LATE_FEE',
  DEPOSIT_REFUND = 'DEPOSIT_REFUND',
  INSURANCE_REFUND = 'INSURANCE_REFUND',
  ADMIN_FEE_REFUND = 'ADMIN_FEE_REFUND',
  RENT_REFUND = 'RENT_REFUND',
}

export type TAccountCategoryQueryResp = {
  id: number;
  name: string;
};

export type TStaticSubAccountQueryResp = {
  id: number;
  name: string;
  code: number;
};

export type TDynamicSubAccountQueryResp = {
  id: number;
  code: number;
  payment_method: TPaymentMethodQueryResp;
};

export type TAccountQueryResp = {
  id: number;
  name: string;
  number_prefix: number;
  ledger_account_category: TAccountCategoryQueryResp;
  ledger_static_sub_accounts: TStaticSubAccountQueryResp[];
  ledger_dynamic_sub_accounts: TDynamicSubAccountQueryResp[];
};
