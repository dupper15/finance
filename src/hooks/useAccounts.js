
import { useEffect } from 'react';
import { useFinance } from '../context/FinanceContext.js';

export function useAccounts() {
  const {
    accounts,
    loading,
    loadAccounts,
    createAccount,
    updateAccount,
    deleteAccount,
  } = useFinance();

  useEffect(() => {
    if (accounts.length === 0 && !loading.accounts) {
      loadAccounts();
    }
  }, [accounts.length, loading.accounts]);

  return {
    accounts,
    loading: loading.accounts,
    createAccount,
    updateAccount,
    deleteAccount,
    refetch: loadAccounts,
  };
}
