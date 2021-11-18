import { TTax, TaxType } from '../types';

/**
 * Get total tax of amount.
 *
 * @param data Amount and tax data.
 * @returns number
 */
const getTaxTotalAmount = (data: { amount: number; tax: TTax }) => {
  const {
    amount,
    tax: { type, value },
  } = data;

  if (type === TaxType.PERCENTAGE) {
    return (amount * value) / 100;
  }

  return value;
};

export { getTaxTotalAmount };
