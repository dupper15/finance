import React, { useState } from 'react';
import { useTwoFactorAuth } from '../../hooks/useTwoFactorAuth.js';
import { TwoFactorSetup } from './TwoFactorSetup.jsx';
import { LoadingSpinner } from '../ui/Loading/LoadingSpinner.js';

export function TwoFactorSettings() {
    const {
        status,
        loading,
        error,
        disable,
        regenerateBackupCodes,
        isEnabled,
        isSetup,
        backupCodesCount,
        refresh
    } = useTwoFactorAuth();

    const [showSetup, setShowSetup] = useState(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [actionError, setActionError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [newBackupCodes, setNewBackupCodes] = useState(null);

    const handleSetupComplete = () => {
        setShowSetup(false);
        refresh();
    };

    const handleDisable = async () => {
        if (!password.trim()) {
            setActionError('Cần mật khẩu để tắt xác thực hai yếu tố');
            return;
        }

        setActionLoading(true);
        setActionError('');

        try {
            await disable(password);
            setShowDisableConfirm(false);
            setPassword('');
        } catch (error) {
            setActionError(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRegenerateBackupCodes = async () => {
        if (!password.trim()) {
            setActionError('Cần mật khẩu để tạo lại mã dự phòng');
            return;
        }

        setActionLoading(true);
        setActionError('');

        try {
            const result = await regenerateBackupCodes(password);
            setNewBackupCodes(result.backupCodes);
            setShowRegenerateConfirm(false);
            setPassword('');
        } catch (error) {
            setActionError(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const downloadBackupCodes = (codes) => {
        const codesText = codes.join('\n');
        const blob = new Blob([codesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup-codes.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    const copyBackupCodes = (codes) => {
        const codesText = codes.join('\n');
        navigator.clipboard.writeText(codesText).then(() => {
            alert('Đã sao chép mã dự phòng vào clipboard!');
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <LoadingSpinner size="md" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!isEnabled ? (
                <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900 mb-2">
                                Xác thực hai yếu tố chưa được bật
                            </h4>
                            <p className="text-sm text-gray-600 mb-4">
                                Bảo vệ tài khoản của bạn bằng cách thêm một lớp bảo mật bổ sung. Bạn sẽ được yêu cầu nhập mã từ ứng dụng xác thực khi đăng nhập.
                            </p>
                            <button
                                onClick={() => setShowSetup(true)}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Bật xác thực hai yếu tố
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="border border-green-200 rounded-lg p-6 bg-green-50">
                    <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-medium text-green-900 mb-2">
                                Xác thực hai yếu tố đã được bật
                            </h4>
                            <p className="text-sm text-green-700 mb-4">
                                Tài khoản của bạn được bảo vệ bằng xác thực hai yếu tố.
                                {status?.verifiedAt && (
                                    <span className="block mt-1">
                                        Đã bật vào {new Date(status.verifiedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                )}
                            </p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="bg-white p-4 rounded-lg border border-green-200">
                                    <h5 className="font-medium text-green-900">Mã dự phòng</h5>
                                    <p className="text-sm text-green-700 mb-2">
                                        Bạn còn {backupCodesCount || 0} mã dự phòng
                                    </p>
                                    <button
                                        onClick={() => setShowRegenerateConfirm(true)}
                                        className="text-sm text-blue-600 hover:text-blue-500"
                                    >
                                        Tạo lại mã dự phòng
                                    </button>
                                </div>

                                <div className="bg-white p-4 rounded-lg border border-green-200">
                                    <h5 className="font-medium text-green-900">Quản lý</h5>
                                    <p className="text-sm text-green-700 mb-2">
                                        Tắt xác thực hai yếu tố
                                    </p>
                                    <button
                                        onClick={() => setShowDisableConfirm(true)}
                                        className="text-sm text-red-600 hover:text-red-500"
                                    >
                                        Tắt xác thực hai yếu tố
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSetup && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        <TwoFactorSetup
                            onComplete={handleSetupComplete}
                            onCancel={() => setShowSetup(false)}
                        />
                    </div>
                </div>
            )}

            {showDisableConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Tắt xác thực hai yếu tố
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Điều này sẽ loại bỏ lớp bảo mật bổ sung khỏi tài khoản của bạn. Vui lòng nhập mật khẩu để xác nhận.
                        </p>

                        {actionError && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                                {actionError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập mật khẩu của bạn"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowDisableConfirm(false);
                                        setPassword('');
                                        setActionError('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDisable}
                                    disabled={actionLoading}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                                >
                                    {actionLoading && <LoadingSpinner size="sm" className="mr-2" />}
                                    Tắt 2FA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showRegenerateConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Tạo lại mã dự phòng
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Các mã dự phòng hiện tại sẽ không còn hoạt động. Vui lòng nhập mật khẩu để tạo mã mới.
                        </p>

                        {actionError && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
                                {actionError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nhập mật khẩu của bạn"
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => {
                                        setShowRegenerateConfirm(false);
                                        setPassword('');
                                        setActionError('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleRegenerateBackupCodes}
                                    disabled={actionLoading}
                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {actionLoading && <LoadingSpinner size="sm" className="mr-2" />}
                                    Tạo lại mã
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {newBackupCodes && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Mã dự phòng mới
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Lưu các mã này ở nơi an toàn. Bạn có thể sử dụng chúng để truy cập tài khoản nếu mất thiết bị xác thực.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                                {newBackupCodes.map((code, index) => (
                                    <div key={index} className="text-center py-1">
                                        {code}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className="space-x-2">
                                <button
                                    onClick={() => downloadBackupCodes(newBackupCodes)}
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    Tải xuống
                                </button>
                                <button
                                    onClick={() => copyBackupCodes(newBackupCodes)}
                                    className="text-sm text-blue-600 hover:text-blue-500"
                                >
                                    Sao chép
                                </button>
                            </div>
                            <button
                                onClick={() => setNewBackupCodes(null)}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}