import { getLedgerAccounts } from '../requests';
import { TAccountQueryResp, IAccountCodes } from '../types';

/**
 * Get all ledger accounts codes and paths.
 *
 * @returns IAccountCodes[]
 */
export const getLedgerAccountCodes = async (): Promise<IAccountCodes[]> => {
  const accounts: TAccountQueryResp[] = await getLedgerAccounts();
  return accounts.reduce((acc, cur) => {
    const {
      ledger_static_sub_accounts: staticSubAccounts = [],
      ledger_dynamic_sub_accounts: dynamicSubAccounts = [],
    } = cur;
    let subAccounts = staticSubAccounts.reduce(
      (acc2, cur2) =>
        acc2.concat({
          code: cur2.code,
          path: `${cur.name}:${cur2.name}`,
        }),
      acc
    );
    subAccounts = dynamicSubAccounts.reduce(
      (acc3, cur3) =>
        acc3.concat({
          code: cur3.code,
          path: `${cur.name}:${cur3.payment_method.name_en}`,
        }),
      subAccounts
    );

    return acc.concat(subAccounts);
  }, [] as IAccountCodes[]);
};
