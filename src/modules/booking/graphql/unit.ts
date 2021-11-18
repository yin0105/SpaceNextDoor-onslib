export const GET_UNIT_SUBTYPE = `
  query getUnitSubType(
    $unitSubtypeId: Int!,
    $buildingId: Int!
  ) {
    unit_subtypes(
      where: {
        _and: {
          id: {_eq: $unitSubtypeId},
          building_id: {_eq: $buildingId}
        }
      },
      limit: 1
    ) {
      id
      height
      width
      length
      measurement_unit
      price_per_month
      currency {
        id
        code
        sign
      }
      unit_type {
        name_en
        name_th
        unit_type_features {
          feature {
            name_en
            id
          }
        }
      }
    }
  }
`;
