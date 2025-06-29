import { useEffect } from 'react';
import { useFinance } from '../context/FinanceContext.js';

export function useDashboard() {
  const {
    dashboardData,
    loading,
    loadDashboard,
  } = useFinance();

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    dashboardData,
    loading: loading.dashboard,
    refetch: loadDashboard,
  };
}