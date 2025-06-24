
import { useState, useEffect } from 'react';
import { useFinance } from '../context/FinanceContext.js';

export function useTransactions(initialFilters = {}) {
  const { 
    transactions, 
    loading, 
    filters,
    loadTransactions,
    setTransactionFilters,
  } = useFinance();

  const [localFilters, setLocalFilters] = useState({
    ...filters.transactions,
    ...initialFilters,
  });

  useEffect(() => {
    setTransactionFilters(localFilters);
    loadTransactions(localFilters);
  }, [localFilters]);

  const updateFilters = (newFilters) => {
    setLocalFilters(prev => ({
      ...prev,
      ...newFilters,
    }));
  };

  const resetFilters = () => {
    setLocalFilters({
      account_id: '',
      category_id: '',
      transaction_type: '',
      start_date: '',
      end_date: '',
      search: '',
      page: 1,
      limit: 50,
    });
  };

  return {
    transactions,
    loading: loading.transactions,
    filters: localFilters,
    updateFilters,
    resetFilters,
    refetch: () => loadTransactions(localFilters),
  };
}
