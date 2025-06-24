
import { useState, useCallback } from 'react';
import { financeService } from '../services/financeService.js';

export function useImportExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const importTransactions = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      const result = await financeService.importTransactions(file);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportTransactions = useCallback(async (filters = {}, format = 'csv') => {
    try {
      setLoading(true);
      setError(null);
      const blob = await financeService.exportTransactions(filters, format);
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `transactions.${format === 'excel' ? 'xlsx' : 'csv'}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportBudgetReport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const blob = await financeService.exportBudgetReport();
      
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'budget-report.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
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
    importTransactions,
    exportTransactions,
    exportBudgetReport,
  };
}
