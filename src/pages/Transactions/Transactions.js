import React from 'react';
import { useTransactions } from '../../hooks/useTransactions.js';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';

export function Transactions() {
    const { transactions, loading } = useTransactions();

    if (loading) {
        return <LoadingSpinner size="lg" className="h-64" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Giao dịch</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Thêm giao dịch
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600">
                    Trang quản lý giao dịch đang được phát triển.
                    Hiện tại có {transactions.length} giao dịch trong hệ thống.
                </p>
            </div>
        </div>
    );
}
