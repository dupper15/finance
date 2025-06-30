import React, { useState } from 'react';
import {TRANSACTION_TYPES} from "../../utils/constants/transactionTypes";
import {formatCurrency} from "../../utils/formatters/currency";
import {formatDate} from "../../utils/formatters/date";

export function TransactionList({
                                    transactions = [],
                                    onEdit,
                                    onDelete,
                                    onSelect,
                                    selectedTransactions = [],
                                    loading = false
                                }) {
    const [selectAll, setSelectAll] = useState(false);

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            onSelect(transactions.map(t => t.transaction_id));
        } else {
            onSelect([]);
        }
    };

    const handleSelectTransaction = (transactionId) => {
        const isSelected = selectedTransactions.includes(transactionId);
        if (isSelected) {
            onSelect(selectedTransactions.filter(id => id !== transactionId));
        } else {
            onSelect([...selectedTransactions, transactionId]);
        }
    };

    const getTransactionTypeIcon = (type) => {
        switch (type) {
            case TRANSACTION_TYPES.INCOME:
                return (
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                    </svg>
                );
            case TRANSACTION_TYPES.EXPENSE:
                return (
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H3" />
                    </svg>
                );
            case TRANSACTION_TYPES.TRANSFER:
                return (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getAmountDisplay = (transaction) => {
        const amount = parseFloat(transaction.amount);
        const sign = transaction.transaction_type === TRANSACTION_TYPES.INCOME ? '+' :
            transaction.transaction_type === TRANSACTION_TYPES.EXPENSE ? '-' : '';

        return {
            display: `${sign}${formatCurrency(amount)}`,
            color: transaction.transaction_type === TRANSACTION_TYPES.INCOME ? 'text-green-600' :
                transaction.transaction_type === TRANSACTION_TYPES.EXPENSE ? 'text-red-600' :
                    'text-blue-600'
        };
    };

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center space-x-4">
                            <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                            </div>
                            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (transactions.length === 0) {
        return (
            <div className="bg-white shadow rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không có giao dịch</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Bắt đầu bằng cách tạo giao dịch đầu tiên.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="col-span-1">
                        <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={handleSelectAll}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>
                    <div className="col-span-2">Ngày</div>
                    <div className="col-span-4">Giao dịch</div>
                    <div className="col-span-2 text-center">Số tiền ($)</div>
                    <div className="col-span-2 text-center">Số dư ($)</div>
                    <div className="col-span-1"></div>
                </div>
            </div>

            <div className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => {
                    const isSelected = selectedTransactions.includes(transaction.transaction_id);
                    const amountDisplay = getAmountDisplay(transaction);

                    return (
                        <div
                            key={transaction.transaction_id}
                            className={`px-6 py-4 hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                        >
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-1">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => handleSelectTransaction(transaction.transaction_id)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <div className="text-sm font-medium text-gray-900">
                                        {formatDate(transaction.transaction_date, 'dd/MM/yyyy')}
                                    </div>
                                </div>

                                <div className="col-span-4">
                                    <div className="flex items-center space-x-3">
                                        {getTransactionTypeIcon(transaction.transaction_type)}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {transaction.description}
                                            </p>
                                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                                                {transaction.categories?.name && (
                                                    <span className="px-2 py-1 bg-gray-100 rounded-full">
                            {transaction.categories.name}
                          </span>
                                                )}
                                                {transaction.accounts?.name && (
                                                    <span>{transaction.accounts.name}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2 text-center">
                                    <div className="flex justify-center">
                                        {transaction.is_split && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                        Phân chia
                      </span>
                                        )}
                                        <span className={`text-sm font-medium ${amountDisplay.color}`}>
                      {amountDisplay.display}
                    </span>
                                    </div>
                                </div>

                                <div className="col-span-2 text-center">
                  <span className="text-sm text-gray-900">
                    {/* This would need to be calculated based on running balance */}
                      {formatCurrency(0)}
                  </span>
                                </div>

                                <div className="col-span-1 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onEdit(transaction)}
                                            className="text-blue-600 hover:text-blue-900 text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDelete(transaction.transaction_id)}
                                            className="text-red-600 hover:text-red-900 text-sm"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                        Hiển thị {transactions.length} giao dịch
                    </div>
                    <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-900">
              Tổng: {formatCurrency(2570.00)}
            </span>
                    </div>
                </div>
            </div>
        </div>
    );
}