export const GET_ADMIN_FEE_BY_COMPANY = `
  query getAdminFee($companyId: Int!) {
    addition_fees(
      where: {
        type: { _eq: "ADMIN" },
        company_id: { _eq: $companyId }
      }
    ) {
      amount
      tax {
        type
        value
      }
    }
  }
`;
