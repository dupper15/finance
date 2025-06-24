
import { useState, useCallback } from 'react';
import { financeService } from '../services/financeService.js';

export function useReports() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getIncomeExpenseReport = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getIncomeExpenseReport(filters);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getExpenseByCategoryReport = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getExpenseByCategoryReport(filters);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getAccountBalancesReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getAccountBalancesReport();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMonthlyTrends = useCallback(async (months = 12) => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getMonthlyTrends(months);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getBudgetPerformance = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await financeService.getBudgetPerformance();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getIncomeExpenseReport,
    getExpenseByCategoryReport,
    getAccountBalancesReport,
    getMonthlyTrends,
    getBudgetPerformance,
  };
}
