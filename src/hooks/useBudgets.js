
import { useEffect } from 'react';
import { useFinance } from '../context/FinanceContext.js';

export function useBudgets() {
  const {
    budgets,
    loading,
    loadBudgets,
    createBudget,
  } = useFinance();

  useEffect(() => {
    if (budgets.length === 0 && !loading.budgets) {
      loadBudgets();
    }
  }, []);

  return {
    budgets,
    loading: loading.budgets,
    createBudget,
    refetch: loadBudgets,
  };
}
