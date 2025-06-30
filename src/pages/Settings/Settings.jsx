import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.js';
import {TwoFactorSettings} from "../../components/setting/TwoFactorSettings";

export function Settings() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', name: 'Hồ sơ', icon: '👤' },
        { id: 'security', name: 'Bảo mật', icon: '🔒' },
        { id: 'preferences', name: 'Tùy chọn', icon: '⚙️' },
        { id: 'notifications', name: 'Thông báo', icon: '🔔' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin tài khoản</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Tên</label>
                                        <p className="mt-1 text-gray-900">{user?.user_metadata?.name || 'Chưa cập nhật'}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Thành viên từ</label>
                                        <p className="mt-1 text-gray-900">
                                            {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Không xác định'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Cập nhật hồ sơ</h4>
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
                                        <input
                                            type="text"
                                            defaultValue={user?.user_metadata?.name || ''}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            defaultValue={user?.user_metadata?.phone || ''}
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Lưu thay đổi
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt bảo mật</h3>
                            </div>

                            <TwoFactorSettings />

                            <div className="border-t pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Đổi mật khẩu</h4>
                                <div className="max-w-md space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                                        <input
                                            type="password"
                                            className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                        Cập nhật mật khẩu
                                    </button>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-lg font-medium text-gray-900 mb-4">Thao tác tài khoản</h4>
                                <div className="space-y-3">
                                    <button className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700">
                                        Xuất dữ liệu tài khoản
                                    </button>
                                    <br />
                                    <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                                        Xóa tài khoản
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'preferences' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Tùy chọn</h3>
                            </div>

                            <div className="max-w-md space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tiền tệ</label>
                                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="VND">Việt Nam Đồng (VND)</option>
                                        <option value="USD">Đô la Mỹ (USD)</option>
                                        <option value="EUR">Euro (EUR)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Ngôn ngữ</label>
                                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="vi">Tiếng Việt</option>
                                        <option value="en">Tiếng Anh</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Múi giờ</label>
                                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                        <option value="Asia/Ho_Chi_Minh">Hồ Chí Minh (GMT+7)</option>
                                        <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
                                        <option value="Asia/Singapore">Singapore (GMT+8)</option>
                                    </select>
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Lưu tùy chọn
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt thông báo</h3>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Thông báo qua Email</h4>
                                        <p className="text-sm text-gray-500">Nhận cập nhật email về tài khoản của bạn</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Cảnh báo ngân sách</h4>
                                        <p className="text-sm text-gray-500">Nhận thông báo khi vượt quá giới hạn ngân sách</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Nhắc nhở giao dịch</h4>
                                        <p className="text-sm text-gray-500">Nhắc nhở về các giao dịch đã lên lịch</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-sm font-medium text-gray-900">Cảnh báo bảo mật</h4>
                                        <p className="text-sm text-gray-500">Thông báo về bảo mật tài khoản</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        defaultChecked
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                </div>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Lưu cài đặt thông báo
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}