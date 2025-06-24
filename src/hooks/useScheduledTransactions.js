
import { useEffect } from 'react';
import { useFinance } from '../context/FinanceContext.js';

export function useScheduledTransactions() {
  const {
    scheduledTransactions,
    loading,
    loadScheduledTransactions,
    createScheduledTransaction,
    updateScheduledTransaction,
    deleteScheduledTransaction,
    toggleScheduledTransaction,
  } = useFinance();

  useEffect(() => {
    if (scheduledTransactions.length === 0 && !loading.scheduledTransactions) {
      loadScheduledTransactions();
    }
  }, []);

  return {
    scheduledTransactions,
    loading: loading.scheduledTransactions,
    createScheduledTransaction,
    updateScheduledTransaction,
    deleteScheduledTransaction,
    toggleScheduledTransaction,
    refetch: loadScheduledTransactions,
  };
}
