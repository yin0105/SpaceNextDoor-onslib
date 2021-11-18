export const GET_PAYMENT_METHOD_BY_ID = `
  query paymentMethod($id: Int!) {
    payment_methods_by_pk(id: $id) {
      id
      name_en
    }
  }
`;
