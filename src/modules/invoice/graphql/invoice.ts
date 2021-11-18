export const CREATE_INVOICE = `
  mutation createInvoice($createInvoicePayload: invoices_insert_input!) {
    insert_invoices_one(object: $createInvoicePayload) {
      id
    }
  }
`;

export const GET_INVOICE = `
  query getInvoice($id: Int!) {
    invoices_by_pk(id: $id) {
      id,
      status,
      renewal {
        id
      }
      booking {
        unit_id
        unit_subtype_id
        building_id
        company_id
        id
        currency_id
        customer_id
      }
      invoice_items_aggregate {
        aggregate {
          sum {
            total_amount
          }
        }
      }
    }
  }
`;
