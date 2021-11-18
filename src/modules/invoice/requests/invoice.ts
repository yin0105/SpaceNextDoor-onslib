import { graphQuery } from '../../../graphql';
import { CREATE_INVOICE } from '../graphql';
import { TInvoicePayload, TInvoiceDataResp } from '../types';
import { GET_INVOICE } from '../graphql/invoice';

/**
 * Create a new invoice.
 *
 * @param payload Invoice payload which include the invoice items.
 * @returns {id: number}
 */
export const createInvoice = async (
  payload: TInvoicePayload
): Promise<number> => {
  const { data } = await graphQuery(CREATE_INVOICE, {
    createInvoicePayload: payload,
  });
  const { id } = data?.insert_invoices_one;

  return id;
};

/**
 * Get invoice by ID.
 *
 * @param id Invoice ID.
 * @returns any
 */
export const getInvoice = async (id: number): Promise<TInvoiceDataResp> => {
  const { data } = await graphQuery(GET_INVOICE, { id });

  const {
    status,
    booking,
    renewal,
    invoice_items_aggregate: aggregation,
  } = data?.invoices_by_pk || {};

  return {
    id,
    renewal,
    booking,
    status,
    total_amount: aggregation?.aggregate?.sum?.amount || 0,
  };
};
