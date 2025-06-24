import React from 'react';
import { useReports } from '../../hooks/useReports.js';

export function Reports() {
    const { loading } = useReports();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Báo cáo</h1>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    Xuất báo cáo
                </button>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600">
                    Trang báo cáo tài chính đang được phát triển.
                </p>
            </div>
        </div>
    );
}
