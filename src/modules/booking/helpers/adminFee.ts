import { TAdminFeePayload, TAdminFee, TaxType } from '../types';

export const getAdminFeePayload = (
  adminFee: TAdminFee | undefined
): TAdminFeePayload => {
  if (adminFee === undefined) {
    return {
      admin_fee_amount: 0,
      admin_fee_tax: 0,
      has_admin_fee: false,
    };
  }

  const { tax, amount } = adminFee;

  let taxAmount = 0;
  const { value: taxValue = 0, type: taxType = 'FIXED_AMOUNT' } = tax || {};
  if (taxType === TaxType.PERCENTAGE) {
    taxAmount = (taxValue * amount) / 100; // Percentage tax.
  } else {
    taxAmount = taxValue;
  }

  return {
    admin_fee_amount: amount,
    admin_fee_tax: taxAmount,
    has_admin_fee: true,
  };
};
