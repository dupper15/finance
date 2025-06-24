import React from 'react';
import {useAccounts} from "../../hooks/useAccounts";
import {formatCurrency} from "../../utils/formatters/currency";
import {ACCOUNT_TYPE_LABELS} from "../../utils/constants/accountTypes";

export function AccountsSidebar({ selectedAccountId, onAccountSelect, className = '' }) {
    const { accounts, loading } = useAccounts();

    const totalBalance = accounts.reduce((sum, account) => sum + parseFloat(account.balance || 0), 0);

    const groupedAccounts = accounts.reduce((groups, account) => {
        const type = account.account_type;
        if (!groups[type]) {
            groups[type] = [];
        }
        groups[type].push(account);
        return groups;
    }, {});

    if (loading) {
        return (
            <div className={`bg-white shadow rounded-lg p-4 ${className}`}>
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-8 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white shadow rounded-lg ${className}`}>
            <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Tài khoản</h3>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
            </div>

            <div className="p-4">
                {/* Total Balance */}
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-900">Tổng số dư</span>
                        <span className="text-lg font-bold text-blue-900">
              {formatCurrency(totalBalance)}
            </span>
                    </div>
                </div>

                {/* All Accounts Option */}
                <button
                    onClick={() => onAccountSelect('')}
                    className={`w-full flex items-center justify-between p-3 text-left rounded-lg mb-2 transition-colors ${
                        selectedAccountId === ''
                            ? 'bg-blue-50 text-blue-900 border border-blue-200'
                            : 'hover:bg-gray-50 text-gray-700'
                    }`}
                >
                    <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <p className="font-medium">Tất cả tài khoản</p>
                            <p className="text-xs text-gray-500">{accounts.length} tài khoản</p>
                        </div>
                    </div>
                </button>

                {/* Grouped Accounts */}
                <div className="space-y-4">
                    {Object.entries(groupedAccounts).map(([accountType, typeAccounts]) => (
                        <div key={accountType}>
                            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                                {ACCOUNT_TYPE_LABELS[accountType] || accountType}
                            </h4>
                            <div className="space-y-1">
                                {typeAccounts.map((account) => (
                                    <button
                                        key={account.account_id}
                                        onClick={() => onAccountSelect(account.account_id)}
                                        className={`w-full flex items-center justify-between p-3 text-left rounded-lg transition-colors ${
                                            selectedAccountId === account.account_id
                                                ? 'bg-blue-50 text-blue-900 border border-blue-200'
                                                : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                    >
                                        <div className="flex items-center min-w-0 flex-1">
                                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-xs font-medium text-white">
                          {account.name.charAt(0).toUpperCase()}
                        </span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium truncate">{account.name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {formatCurrency(account.balance)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="ml-2">
                                            {account.balance >= 0 ? (
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            ) : (
                                                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {accounts.length === 0 && (
                    <div className="text-center py-8">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có tài khoản</h3>
                        <p className="mt-1 text-sm text-gray-500">Hãy tạo tài khoản đầu tiên</p>
                        <div className="mt-6">
                            <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Thêm tài khoản
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}