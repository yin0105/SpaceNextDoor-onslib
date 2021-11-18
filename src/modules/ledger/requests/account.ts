import { graphQuery } from '../../../graphql';
import { GET_LEDGER_ACCOUNTS } from '../graphql';
import { TAccountQueryResp } from '../types';

/**
 * Get Accounts
 * @returns IAccountCode[]
 */
export const getLedgerAccounts = async (): Promise<TAccountQueryResp[]> => {
  const { data } = await graphQuery(GET_LEDGER_ACCOUNTS);
  return data?.ledger_accounts || [];
};
