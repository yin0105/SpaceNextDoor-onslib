import { graphQuery } from '../../../graphql';
import { GET_PAYMENT_METHOD_BY_ID } from '../graphql';
import { TPaymentMethodQueryResp } from '../types';

/**
 * Get payment method by ID.
 * @param id payment method ID.
 * @returns any
 */
export const getPaymentMethodById = async (
  id: number
): Promise<TPaymentMethodQueryResp> => {
  const { data } = await graphQuery(GET_PAYMENT_METHOD_BY_ID, { id });
  return data?.payment_methods_by_pk;
};
