import { graphQuery } from '../../../graphql';
import { GET_INSURANCE } from '../graphql/insurance';
import { TGeneratedInsurance } from '../types/insurance';

export async function getInsurance(id: number): Promise<TGeneratedInsurance> {
  const { data } = await graphQuery(GET_INSURANCE, { id });
  return data.insurances_by_pk;
}
