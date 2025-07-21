import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useFinance } from '../../context/FinanceContext';
import { useImportExport } from '../../hooks/useImportExport';
import { useAccounts } from '../../hooks/useAccounts';
import { TransactionForm } from '../../components/forms/TransactionForm';
import { TransactionFilter } from '../../components/features/TransactionFilter';
import { TransactionList } from '../../components/features/TransactionList';
import { TransactionSummaryCards } from '../../components/features/TransactionSummaryCards';
import { AccountsSidebar } from '../../components/features/AccountsSidebar';
import { ScheduledTransactionsSidebar } from '../../components/features/ScheduledTransactionsSidebar';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner';
import { formatCurrency } from '../../utils/formatters/currency';

export function Transactions() {
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showFilter, setShowFilter] = useState(false);
    const [selectedTransactions, setSelectedTransactions] = useState([]);
    const [showBulkActions, setShowBulkActions] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [selectedAccountId, setSelectedAccountId] = useState('');

    const { transactions, loading, filters, updateFilters, resetFilters, refetch } = useTransactions({
        account_id: selectedAccountId
    });
    const { createTransaction, updateTransaction, deleteTransaction } = useFinance();
    const { importTransactions, exportTransactions, loading: importExportLoading } = useImportExport();
    const { accounts } = useAccounts();

    const [summary, setSummary] = useState({
        totalIncome: 0,
        totalExpenses: 0,
        netAmount: 0
    });

    useEffect(() => {
        if (transactions.length > 0) {
            const newSummary = transactions.reduce((acc, transaction) => {
                const amount = parseFloat(transaction.amount);
                if (transaction.transaction_type === 'income') {
                    acc.totalIncome += amount;
                } else if (transaction.transaction_type === 'expense') {
                    acc.totalExpenses += amount;
                }
                return acc;
            }, { totalIncome: 0, totalExpenses: 0 });

            newSummary.netAmount = newSummary.totalIncome - newSummary.totalExpenses;
            setSummary(newSummary);
        }
    }, [transactions]);

    useEffect(() => {
        updateFilters({ account_id: selectedAccountId });
    }, [selectedAccountId   ]);

    const handleCreateTransaction = () => {
        setEditingTransaction(null);
        setShowForm(true);
    };

    const handleEditTransaction = (transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

    const handleDuplicateTransaction = (transaction) => {
        const duplicatedTransaction = {
            ...transaction,
            description: `${transaction.description} (Copy)`,
            transaction_date: new Date().toISOString(),
        };
        delete duplicatedTransaction.transaction_id;
        setEditingTransaction(duplicatedTransaction);
        setShowForm(true);
    };

    const handleDeleteTransaction = (transaction) => {
        setDeleteConfirm(transaction);
    };

    const confirmDelete = async () => {
        if (deleteConfirm) {
            try {
                await deleteTransaction(deleteConfirm.transaction_id);
                setDeleteConfirm(null);
                refetch();
            } catch (error) {
                console.error('Error deleting transaction:', error);
            }
        }
    };

    const handleFormSubmit = async (transactionData) => {
        try {
            if (editingTransaction?.transaction_id) {
                await updateTransaction(editingTransaction.transaction_id, transactionData);
            } else {
                await createTransaction(transactionData);
            }
            setShowForm(false);
            setEditingTransaction(null);
            refetch();
        } catch (error) {
            console.error('Error saving transaction:', error);
        }
    };

    const handleFormCancel = () => {
        setShowForm(false);
        setEditingTransaction(null);
    };

    const handleFilterChange = (newFilters) => {
        updateFilters(newFilters);
    };

    const handleFilterApply = (newFilters) => {
        updateFilters(newFilters);
        setShowFilter(false);
    };

    const handleFilterClear = () => {
        resetFilters();
        setSelectedAccountId('');
        setShowFilter(false);
    };

    const handleBulkDelete = async () => {
        if (selectedTransactions.length === 0) return;

        try {
            await Promise.all(
                selectedTransactions.map(id => deleteTransaction(id))
            );
            setSelectedTransactions([]);
            setShowBulkActions(false);
            refetch();
        } catch (error) {
            console.error('Error deleting transactions:', error);
        }
    };

    const handleExport = async (format = 'csv') => {
        try {
            await exportTransactions(filters, format);
        } catch (error) {
            console.error('Error exporting transactions:', error);
        }
    };

    const handleImport = async (file) => {
        try {
            const result = await importTransactions(file);
            console.log('Import result:', result);
            refetch();
        } catch (error) {
            console.error('Error importing transactions:', error);
        }
    };

    const toggleBulkActions = () => {
        setShowBulkActions(!showBulkActions);
        setSelectedTransactions([]);
    };

    const accountsData = {
        totalBalance: accounts.reduce((sum, account) => sum + parseFloat(account.balance || 0), 0)
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                {/* Left Sidebar */}
                <div className="w-80 flex-shrink-0 space-y-6 p-6">
                    <AccountsSidebar
                        selectedAccountId={selectedAccountId}
                        onAccountSelect={setSelectedAccountId}
                    />
                    <ScheduledTransactionsSidebar />
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="space-y-6">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-bold text-gray-900">Giao dịch</h1>
                            <div className="text-sm text-gray-500">
                                Dashboard / <span className="text-gray-900">Giao dịch</span>
                            </div>
                        </div>

                        {/* Summary Cards */}
                        <TransactionSummaryCards summary={summary} accountsData={accountsData} />

                        {/* Action Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleCreateTransaction}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Thêm
                                </button>

                                {/*<button*/}
                                {/*    onClick={toggleBulkActions}*/}
                                {/*    className={`inline-flex items-center px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${*/}
                                {/*        showBulkActions*/}
                                {/*            ? 'text-blue-700 bg-blue-50 border-blue-300'*/}
                                {/*            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'*/}
                                {/*    }`}*/}
                                {/*>*/}
                                {/*    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />*/}
                                {/*    </svg>*/}
                                {/*    Xóa*/}
                                {/*</button>*/}

                                {/*<button*/}
                                {/*    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"*/}
                                {/*>*/}
                                {/*    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                                {/*        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />*/}
                                {/*    </svg>*/}
                                {/*    Thao tác hàng loạt*/}
                                {/*</button>*/}

                                {showBulkActions && selectedTransactions.length > 0 && (
                                    <button
                                        onClick={handleBulkDelete}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-300 rounded-md hover:bg-red-100"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Xóa đã chọn ({selectedTransactions.length})
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="relative">
                                    <button
                                        onClick={() => document.getElementById('import-file').click()}
                                        disabled={importExportLoading}
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                                        </svg>
                                        Nhập
                                    </button>
                                    <input
                                        id="import-file"
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                handleImport(file);
                                                e.target.value = '';
                                            }
                                        }}
                                        className="hidden"
                                    />
                                </div>

                                <button
                                    onClick={() => handleExport('csv')}
                                    disabled={importExportLoading}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    Xuất
                                </button>
                            </div>
                        </div>

                        {/* Filter Component */}
                        <TransactionFilter
                            filters={filters}
                            onFiltersChange={handleFilterChange}
                            onApply={handleFilterApply}
                            onClear={handleFilterClear}
                            isOpen={showFilter}
                            onToggle={() => setShowFilter(!showFilter)}
                        />

                        {/* Summary Display */}
                        <div className="bg-white shadow rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(summary.totalIncome - summary.totalExpenses)}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Hiển thị {transactions.length} giao dịch
                                </div>
                            </div>
                        </div>

                        {/* Transaction List */}
                        <TransactionList
                            transactions={transactions}
                            loading={loading}
                            onEdit={handleEditTransaction}
                            onDelete={handleDeleteTransaction}
                            onDuplicate={handleDuplicateTransaction}
                            selectedIds={selectedTransactions}
                            onSelectionChange={setSelectedTransactions}
                            showCheckboxes={showBulkActions}
                        />
                    </div>
                </div>
            </div>

            {/* Transaction Form Modal */}
            <TransactionForm
                transaction={editingTransaction}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isOpen={showForm}
            />

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16c-.77.833-.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Xác nhận xóa giao dịch</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    Bạn có chắc chắn muốn xóa giao dịch "{deleteConfirm.description}"?
                                    Hành động này không thể hoàn tác.
                                </p>
                            </div>
                            <div className="flex justify-center space-x-3 mt-4">
                                <button
                                    onClick={() => setDeleteConfirm(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {importExportLoading && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 flex flex-col items-center">
                        <LoadingSpinner size="lg" />
                        <p className="mt-4 text-gray-600">Đang xử lý...</p>
                    </div>
                </div>
            )}
        </div>
    );
}