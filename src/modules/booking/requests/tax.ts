import { GET_TAXES, APPLY_TAXES } from '../graphql';
import { graphQuery } from '../../../graphql';
import { NotFoundError } from '../../../exceptions/not-found.exception';

export async function getTaxes(
  buildingId: number,
  companyId: number
): Promise<any> {
  const { data } = await graphQuery(GET_TAXES, {
    buildingId: buildingId,
    companyId: companyId,
  });

  return data;
}

export async function applyTaxes(taxes: any): Promise<any> {
  const { data } = await graphQuery(APPLY_TAXES, {
    applied_taxes: taxes,
  });

  if (!data.insert_applied_taxes) {
    throw new NotFoundError('Error adding taxes');
  }

  return data;
}
