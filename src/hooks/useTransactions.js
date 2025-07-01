import { useState, useEffect, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext.js';

export function useTransactions(initialFilters = {}) {
  const {
    transactions,
    loading,
    filters,
    loadTransactions,
    setTransactionFilters,
    createTransaction,
    updateTransaction,
    deleteTransaction
  } = useFinance();

  const [localFilters, setLocalFilters] = useState({
    account_id: '',
    category_id: '',
    transaction_type: '',
    start_date: '',
    end_date: '',
    search: '',
    page: 1,
    limit: 50,
    ...filters.transactions,
    ...initialFilters,
  });

  // Load transactions when filters change
  useEffect(() => {
    loadTransactions(localFilters);
  }, [loadTransactions, localFilters]);

  const updateFilters = useCallback((newFilters) => {
    const updatedFilters = {
      ...localFilters,
      ...newFilters,
      page: newFilters.page || 1 // Reset to first page when filters change
    };

    setLocalFilters(updatedFilters);
    setTransactionFilters(updatedFilters);
  }, [localFilters, setTransactionFilters]);

  const resetFilters = useCallback(() => {
    const defaultFilters = {
      account_id: '',
      category_id: '',
      transaction_type: '',
      start_date: '',
      end_date: '',
      search: '',
      page: 1,
      limit: 50,
    };

    setLocalFilters(defaultFilters);
    setTransactionFilters(defaultFilters);
  }, [setTransactionFilters]);

  const refetch = useCallback(() => {
    loadTransactions(localFilters);
  }, [loadTransactions, localFilters]);

  const createTransactionAndRefresh = useCallback(async (transactionData) => {
    try {
      const result = await createTransaction(transactionData);
      await refetch(); // Refresh the list after creating
      return result;
    } catch (error) {
      throw error;
    }
  }, [createTransaction, refetch]);

  const updateTransactionAndRefresh = useCallback(async (transactionId, transactionData) => {
    try {
      const result = await updateTransaction(transactionId, transactionData);
      await refetch(); // Refresh the list after updating
      return result;
    } catch (error) {
      throw error;
    }
  }, [updateTransaction, refetch]);

  const deleteTransactionAndRefresh = useCallback(async (transactionId) => {
    try {
      await deleteTransaction(transactionId);
      await refetch(); // Refresh the list after deleting
    } catch (error) {
      throw error;
    }
  }, [deleteTransaction, refetch]);

  // Calculate summary statistics
  const statistics = useState(() => {
    const income = transactions
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const expenses = transactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    const transfers = transactions
        .filter(t => t.transaction_type === 'transfer')
        .reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalTransfers: transfers,
      netIncome: income - expenses,
      totalTransactions: transactions.length
    };
  }, [transactions]);

  return {
    transactions,
    loading: loading.transactions,
    filters: localFilters,
    statistics,
    updateFilters,
    resetFilters,
    refetch,
    createTransaction: createTransactionAndRefresh,
    updateTransaction: updateTransactionAndRefresh,
    deleteTransaction: deleteTransactionAndRefresh,
  };
}