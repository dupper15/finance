import React from 'react';
import { useAuth } from '../../context/AuthContext.js';

export function Settings() {
    const { user } = useAuth();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin tài khoản</h3>
                <div className="space-y-3">
                    <div>
                        <label className="text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-900">{user?.email}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-500">Tên</label>
                        <p className="text-gray-900">{user?.user_metadata?.name || 'Chưa cập nhật'}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
                <p className="text-gray-600">
                    Các tùy chọn cài đặt khác đang được phát triển.
                </p>
            </div>
        </div>
    );
}