import { graphQuery } from '../../../graphql';
import { GET_UNIT_SUBTYPE } from '../graphql';
import { TGeneratedUnitSubType } from '../types/unit';

export async function getUnitSubType(
  unitSubtypeId: number,
  buildingId: number
): Promise<TGeneratedUnitSubType> {
  const { data } = await graphQuery(GET_UNIT_SUBTYPE, {
    unitSubtypeId,
    buildingId,
  });
  const [unitSubtype] = data.unit_subtypes || [];

  return unitSubtype;
}
