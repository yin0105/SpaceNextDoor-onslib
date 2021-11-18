export const GET_INSURANCE = `
  query GetInsurance($id: Int!) {
    insurances_by_pk(id: $id) {
      id
      price_per_day
      price_per_month
    }
  }
`;
