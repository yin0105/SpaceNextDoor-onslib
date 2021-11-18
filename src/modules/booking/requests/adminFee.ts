import { graphQuery } from '../../../graphql';
import { TAdminFee } from '../types';
import { GET_ADMIN_FEE_BY_COMPANY } from '../graphql';

/**
 * Get company admin fee by company id.
 *
 * @author Ken Le
 * @param companyId Company ID
 * @returns TAdminFee
 */
export const getAdminFeeByCompany = async (
  companyId: number
): Promise<TAdminFee | undefined> => {
  const { data } = await graphQuery(GET_ADMIN_FEE_BY_COMPANY, {
    companyId,
  });
  const [adminFee] = data?.addition_fees || [];

  return adminFee;
};
