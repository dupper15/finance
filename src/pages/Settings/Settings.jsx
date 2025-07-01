import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext.js';
import { TwoFactorSettings } from '../../components/setting/TwoFactorSettings.jsx';
import { LoadingSpinner } from '../../components/ui/Loading/LoadingSpinner.js';

export function Settings() {
    const { user, updateProfile, changePassword, loading, error: contextError, clearError } = useUser();
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: '',
        phone: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');

    const tabs = [
        { id: 'profile', name: 'Hồ sơ', icon: '👤' },
        { id: 'security', name: 'Bảo mật', icon: '🔒' }
    ];

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.user_metadata?.name || user.name || '',
                phone: user.user_metadata?.phone || user.phone || ''
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');
        clearError();

        try {
            await updateProfile(profileData);
            setSuccess('Cập nhật hồ sơ thành công');
        } catch (error) {
            setErrors({ profile: error.message });
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');
        clearError();

        if (passwordData.new_password !== passwordData.confirm_password) {
            setErrors({ confirm_password: 'Mật khẩu xác nhận không khớp' });
            return;
        }

        try {
            await changePassword({
                current_password: passwordData.current_password,
                new_password: passwordData.new_password,
                confirm_password: passwordData.confirm_password
            });
            setPasswordData({
                current_password: '',
                new_password: '',
                confirm_password: ''
            });
            setSuccess('Đổi mật khẩu thành công');
        } catch (error) {
            setErrors({ password: error.message });
        }
    };

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
                    {success && (
                        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {success}
                        </div>
                    )}

                    {activeTab === 'profile' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin tài khoản</h3>
                                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Email</span>
                                        <p className="text-sm text-gray-900">{user?.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Tên</span>
                                        <p className="text-sm text-gray-900">
                                            {profileData.name || 'Chưa cập nhật'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-gray-700">Thành viên từ</span>
                                        <p className="text-sm text-gray-900">
                                            {user?.created_at ? new Date(user.created_at).toLocaleDateString('vi-VN') : 'Không xác định'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/*<div className="border-t pt-6">*/}
                            {/*    <h4 className="text-lg font-medium text-gray-900 mb-4">Cập nhật hồ sơ</h4>*/}
                            {/*    <form onSubmit={handleProfileSubmit} className="max-w-md space-y-4">*/}
                            {/*        {errors.profile && (*/}
                            {/*            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">*/}
                            {/*                {errors.profile}*/}
                            {/*            </div>*/}
                            {/*        )}*/}

                            {/*        <div>*/}
                            {/*            <label className="block text-sm font-medium text-gray-700 mb-1">*/}
                            {/*                Họ và tên*/}
                            {/*            </label>*/}
                            {/*            <input*/}
                            {/*                type="text"*/}
                            {/*                name="name"*/}
                            {/*                value={profileData.name}*/}
                            {/*                onChange={handleProfileChange}*/}
                            {/*                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
                            {/*                placeholder="Nhập họ và tên"*/}
                            {/*            />*/}
                            {/*            {errors.name && (*/}
                            {/*                <p className="mt-1 text-sm text-red-600">{errors.name}</p>*/}
                            {/*            )}*/}
                            {/*        </div>*/}

                            {/*        <div>*/}
                            {/*            <label className="block text-sm font-medium text-gray-700 mb-1">*/}
                            {/*                Số điện thoại*/}
                            {/*            </label>*/}
                            {/*            <input*/}
                            {/*                type="tel"*/}
                            {/*                name="phone"*/}
                            {/*                value={profileData.phone}*/}
                            {/*                onChange={handleProfileChange}*/}
                            {/*                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"*/}
                            {/*                placeholder="Nhập số điện thoại"*/}
                            {/*            />*/}
                            {/*            {errors.phone && (*/}
                            {/*                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>*/}
                            {/*            )}*/}
                            {/*        </div>*/}

                            {/*        <button*/}
                            {/*            type="submit"*/}
                            {/*            disabled={loading.update}*/}
                            {/*            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"*/}
                            {/*        >*/}
                            {/*            {loading.update && <LoadingSpinner size="sm" className="mr-2" />}*/}
                            {/*            Lưu thay đổi*/}
                            {/*        </button>*/}
                            {/*    </form>*/}
                            {/*</div>*/}
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt bảo mật</h3>

                                <div className="mb-8">
                                    <h4 className="text-md font-medium text-gray-900 mb-4">Xác thực hai yếu tố</h4>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                        <p className="text-sm text-blue-700">
                                            Xác thực hai yếu tố chưa được bật. Bật nó để thêm một lớp bảo mật bổ sung cho tài khoản của bạn.
                                        </p>
                                    </div>
                                    <TwoFactorSettings />
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Đổi mật khẩu</h4>
                                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                                    {errors.password && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                            {errors.password}
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mật khẩu hiện tại
                                        </label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            value={passwordData.current_password}
                                            onChange={handlePasswordChange}
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập mật khẩu hiện tại"
                                        />
                                        {errors.current_password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            value={passwordData.new_password}
                                            onChange={handlePasswordChange}
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                        />
                                        {errors.new_password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            name="confirm_password"
                                            value={passwordData.confirm_password}
                                            onChange={handlePasswordChange}
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Xác nhận mật khẩu mới"
                                        />
                                        {errors.confirm_password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading.update}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                    >
                                        {loading.update && <LoadingSpinner size="sm" className="mr-2" />}
                                        Đổi mật khẩu
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}