const fetch = require('node-fetch');

const adminSecret = process.env.ADMIN_SECRET;
const hgeEndpoint = process.env.HGE_ENDPOINT;
const onsLedgerUrl = process.env.ONS_GENERAL_LEDGER_URL;

export async function graphQuery(
  query: string,
  qv?: any,
  returnError?: boolean
) {
  const res = await fetch(hgeEndpoint + '/v1/graphql', {
    method: 'POST',
    body: JSON.stringify({ query: query, variables: qv || {} }),
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': adminSecret,
    },
  });
  const json = await res.json();
  if (!returnError && json.errors && json.errors.length > 0) {
    throw Error(json.errors[0].message);
  }
  return json;
}

export async function ledgerGraphQuery(
  query: string,
  qv?: any,
  returnError?: boolean
) {
  const res = await fetch(onsLedgerUrl, {
    method: 'POST',
    body: JSON.stringify({ query: query, variables: qv || {} }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const json = await res.json();
  if (!returnError && json.errors && json.errors.length > 0) {
    throw Error(json.errors[0].message);
  }
  return json;
}
