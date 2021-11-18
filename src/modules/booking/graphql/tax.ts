export const GET_TAXES = `
  query getInsuranceTaxesQuery($buildingId: Int!, $companyId: Int!) {
    insurance_taxes(where: {status: {_eq: "ACTIVE"}, company_id: {_eq: $companyId}}){
      name_en
      name_th
      value
      id
      type
      currency_id
    }
    building_taxes(where: {status: {_eq: "ACTIVE"}, building_id: {_eq: $buildingId}, company_id: {_eq: $companyId}}) {
      name_en
      name_th
      value
      id
      type
      value
      currency_id
    }
  }
`;

export const APPLY_TAXES = `
  mutation applyTax( $applied_taxes: [applied_taxes_insert_input!]!) {
    insert_applied_taxes(objects: $applied_taxes ){
      affected_rows
    }
  }
`;
