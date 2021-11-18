export const GET_LEDGER_ACCOUNTS = `
  query ledgerAccounts {
    ledger_accounts {
      id
      name
      number_prefix
      ledger_account_category {
        id
        name
      }
      ledger_static_sub_accounts {
        id
        name
        code
      }
      ledger_dynamic_sub_accounts {
        id
        code
        payment_method {
          id
          name_en
          name_th
        }
      }
    }
  }
`;
