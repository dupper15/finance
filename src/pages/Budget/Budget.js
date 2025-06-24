import React from 'react';
import { useBudgets } from '../../hooks/useBudgets.js';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';

export function Budget() {
    const { budgets, loading } = useBudgets();

    if (loading) {
        return <LoadingSpinner size="lg" className="h-64" />;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Ngân sách</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Tạo ngân sách
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600">
                    Trang quản lý ngân sách đang được phát triển.
                    Hiện tại có {budgets.length} ngân sách trong hệ thống.
                </p>
            </div>
        </div>
    );
}