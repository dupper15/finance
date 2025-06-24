
import { useEffect } from 'react';
import { useFinance } from '../context/FinanceContext.js';

export function useCategories() {
  const {
    categories,
    loading,
    loadCategories,
    createCategory,
  } = useFinance();

  useEffect(() => {
    if (categories.length === 0 && !loading.categories) {
      loadCategories();
    }
  }, []);

  return {
    categories,
    loading: loading.categories,
    createCategory,
    refetch: loadCategories,
  };
}
