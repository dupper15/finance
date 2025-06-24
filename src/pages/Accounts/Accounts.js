import React from 'react';
import { useAccounts } from '../../hooks/useAccounts.js';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';
import { formatCurrency } from '../../utils/formatters/currency.js';

export function Accounts() {
    const { accounts, loading } = useAccounts();

    if (loading) {
        return <LoadingSpinner size="lg" className="h-64" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Tài khoản</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Thêm tài khoản
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {accounts.map((account) => (
                    <div key={account.account_id} className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{account.account_type}</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                            {formatCurrency(account.balance)}
                        </p>
                    </div>
                ))}
            </div>

            {accounts.length === 0 && (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                    <p className="text-gray-600">Chưa có tài khoản nào. Hãy tạo tài khoản đầu tiên!</p>
                </div>
            )}
        </div>
    );
}
