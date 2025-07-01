import React, {useState, useEffect} from 'react';
import {useUser} from '../../context/UserContext.js';
import {TwoFactorSettings} from '../../components/setting/TwoFactorSettings.jsx';
import {TwoFactorVerification} from '../../components/auth/TwoFactorVerification.jsx';
import {LoadingSpinner} from '../../components/ui/Loading/LoadingSpinner.js';
import {useTwoFactorAuth} from '../../hooks/useTwoFactorAuth.js';
import {twoFactorAuthService} from '../../services/twoFactorAuthService.js';

export function Settings() {
    const {user, updateProfile, changePassword, loading, error: contextError, clearError} = useUser();
    const {isEnabled: twoFactorEnabled} = useTwoFactorAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: '', phone: ''
    });
    const [passwordData, setPasswordData] = useState({
        current_password: '', new_password: '', confirm_password: ''
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [showTwoFactorVerification, setShowTwoFactorVerification] = useState(false);
    const [pendingPasswordChange, setPendingPasswordChange] = useState(null);

    const tabs = [{id: 'profile', name: 'Hồ sơ', icon: '👤'}, {id: 'security', name: 'Bảo mật', icon: '🔒'}];

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.user_metadata?.name || user.name || '', phone: user.user_metadata?.phone || user.phone || ''
            });
        }
    }, [user]);

    const handleProfileChange = (e) => {
        const {name, value} = e.target;
        setProfileData(prev => ({
            ...prev, [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev, [name]: ''
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const {name, value} = e.target;
        setPasswordData(prev => ({
            ...prev, [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev, [name]: ''
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
            setSuccess('✅ Cập nhật hồ sơ thành công!');
            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            const errorMessage = error.message || 'Cập nhật hồ sơ thất bại. Vui lòng thử lại.';
            setErrors({profile: `❌ ${errorMessage}`});
            setTimeout(() => setErrors({}), 6000);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess('');
        clearError();

        if (passwordData.new_password !== passwordData.confirm_password) {
            setErrors({confirm_password: 'Mật khẩu xác nhận không khớp'});
            return;
        }

        const passwordPayload = {
            current_password: passwordData.current_password,
            new_password: passwordData.new_password,
            confirm_password: passwordData.confirm_password
        };

        if (twoFactorEnabled) {
            setPendingPasswordChange(passwordPayload);
            setShowTwoFactorVerification(true);
        } else {
            await executePasswordChange(passwordPayload);
        }
    };

    const executePasswordChange = async (passwordPayload) => {
        try {
            await changePassword(passwordPayload);
            setPasswordData({
                current_password: '', new_password: '', confirm_password: ''
            });
            setSuccess('🎉 Đổi mật khẩu thành công! Tài khoản của bạn đã được bảo mật.');
            setTimeout(() => setSuccess(''), 5000);
        } catch (error) {
            let errorMessage = 'Đổi mật khẩu thất bại. Vui lòng thử lại.';

            if (error.message.includes('Current password is incorrect')) {
                errorMessage = '❌ Mật khẩu hiện tại không đúng. Vui lòng kiểm tra lại.';
            } else if (error.message.includes('New password must be at least')) {
                errorMessage = '❌ Mật khẩu mới phải có ít nhất 6 ký tự.';
            } else if (error.message.includes('Two-factor authentication required')) {
                errorMessage = '🔐 Cần xác thực hai yếu tố để đổi mật khẩu.';
            } else if (error.message) {
                errorMessage = `❌ ${error.message}`;
            }

            setErrors({password: errorMessage});
            setTimeout(() => setErrors({}), 8000);
        }
    };

    const handleTwoFactorSuccess = async (twoFactorToken) => {
        twoFactorAuthService.setTwoFactorToken(twoFactorToken);
        setShowTwoFactorVerification(false);

        if (pendingPasswordChange) {
            await executePasswordChange(pendingPasswordChange);
            setPendingPasswordChange(null);
        }

        setTimeout(() => {
            twoFactorAuthService.clearTwoFactorToken();
        }, 60000);
    };

    const handleTwoFactorCancel = () => {
        setShowTwoFactorVerification(false);
        setPendingPasswordChange(null);
    };

    return (<div className="space-y-6">
            {showTwoFactorVerification && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            🔐 Xác thực hai yếu tố
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Để đổi mật khẩu, vui lòng nhập mã xác thực từ ứng dụng authenticator của bạn.
                        </p>
                        <TwoFactorVerification
                            onSuccess={handleTwoFactorSuccess}
                            onCancel={handleTwoFactorCancel}
                            userEmail={user?.email}
                        />
                    </div>
                </div>)}

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
                {twoFactorEnabled && (
                    <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        2FA được bật
                    </div>)}
            </div>

            <div className="bg-white shadow rounded-lg">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        {tabs.map((tab) => (<button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                            >
                                <span className="mr-2">{tab.icon}</span>
                                {tab.name}
                            </button>))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'profile' && (<div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Thông tin cá nhân</h3>

                                {success && (<div
                                        className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                        <span className="text-base mr-2">✅</span>
                                        <span className="font-medium">{success}</span>
                                    </div>)}

                                {errors.profile && (<div
                                        className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                                        <span className="text-base mr-2">❌</span>
                                        <span className="font-medium">{errors.profile}</span>
                                    </div>)}

                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên hiển thị
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={profileData.name}
                                            onChange={handleProfileChange}
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập tên hiển thị"
                                        />
                                        {errors.name && (<p className="mt-1 text-sm text-red-600">{errors.name}</p>)}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={profileData.phone}
                                            onChange={handleProfileChange}
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Nhập số điện thoại (tùy chọn)"
                                        />
                                        {errors.phone && (<p className="mt-1 text-sm text-red-600">{errors.phone}</p>)}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading.update}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
                                    >
                                        {loading.update && <LoadingSpinner size="sm" className="mr-2"/>}
                                        Cập nhật hồ sơ
                                    </button>
                                </form>
                            </div>
                        </div>)}

                    {activeTab === 'security' && (<div className="space-y-8">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Xác thực hai yếu tố (2FA)</h3>
                                <div className="text-sm text-gray-600 mb-4">
                                    <p>
                                        Xác thực hai yếu tố bảo vệ tài khoản của bạn bằng cách yêu cầu mã bảo mật từ
                                        điện thoại khi đăng nhập.
                                    </p>
                                    <p className="mt-2">
                                        Bật nó để thêm một lớp bảo mật bổ sung cho tài khoản của bạn.
                                    </p>
                                </div>
                                <TwoFactorSettings/>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="text-md font-medium text-gray-900 mb-4">Đổi mật khẩu</h4>
                                <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
                                    {success && !errors.password && (<div
                                            className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                                            <span className="font-medium">{success}</span>
                                        </div>)}

                                    {errors.password && (<div
                                            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                                            <span className="font-medium">{errors.password}</span>
                                        </div>)}

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
                                            <p className="mt-1 text-sm text-red-600">{errors.current_password}</p>)}
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
                                            <p className="mt-1 text-sm text-red-600">{errors.new_password}</p>)}
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
                                            <p className="mt-1 text-sm text-red-600">{errors.confirm_password}</p>)}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading.update}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center transition-colors"
                                    >
                                        {loading.update && <LoadingSpinner size="sm" className="mr-2"/>}
                                        {twoFactorEnabled ? '🔐 Đổi mật khẩu với 2FA' : 'Đổi mật khẩu'}
                                    </button>

                                    {twoFactorEnabled && (<p className="text-xs text-gray-500 mt-2">
                                            💡 Xác thực hai yếu tố sẽ được yêu cầu để xác nhận thay đổi mật khẩu
                                        </p>)}
                                </form>
                            </div>
                        </div>)}
                </div>
            </div>
        </div>);
}