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
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!isEnabled ? (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
                    <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                Xác thực hai yếu tố chưa được bật
                            </h4>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Bảo vệ tài khoản của bạn bằng cách thêm một lớp bảo mật bổ sung.
                                Bạn sẽ được yêu cầu nhập mã từ ứng dụng xác thực khi đăng nhập.
                            </p>

                            <div className="bg-white rounded-lg p-4 mb-6 border border-blue-100">
                                <h5 className="font-medium text-gray-900 mb-3">Lợi ích của xác thực hai yếu tố:</h5>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Bảo vệ chống lại việc truy cập trái phép</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Tăng cường bảo mật ngay cả khi mật khẩu bị lộ</span>
                                    </li>
                                    <li className="flex items-center space-x-2">
                                        <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>Tuân thủ các tiêu chuẩn bảo mật hiện đại</span>
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => setShowSetup(true)}
                                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Bật xác thực hai yếu tố
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-8">
                    <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-900 mb-3">
                                Xác thực hai yếu tố đã được bật
                            </h4>
                            <p className="text-gray-600 mb-6">
                                Tài khoản của bạn được bảo vệ bằng xác thực hai yếu tố.
                                {status?.verifiedAt && (
                                    <span className="block mt-1 text-sm">
                                        Được kích hoạt vào {new Date(status.verifiedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                )}
                            </p>

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                        <h5 className="font-semibold text-gray-900">Mã dự phòng</h5>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Bạn còn <span className="font-semibold text-gray-900">{backupCodesCount || 0}</span> mã dự phòng
                                    </p>
                                    <button
                                        onClick={() => setShowRegenerateConfirm(true)}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        Tạo lại mã dự phòng →
                                    </button>
                                </div>

                                <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                        <h5 className="font-semibold text-gray-900">Quản lý bảo mật</h5>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Tắt xác thực hai yếu tố cho tài khoản này
                                    </p>
                                    <button
                                        onClick={() => setShowDisableConfirm(true)}
                                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                                    >
                                        Tắt xác thực hai yếu tố →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showSetup && (
                <TwoFactorSetup
                    onComplete={handleSetupComplete}
                    onCancel={() => setShowSetup(false)}
                />
            )}

            {showDisableConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16c-.77.833-.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Tắt xác thực hai yếu tố
                            </h3>
                            <p className="text-gray-600">
                                Điều này sẽ loại bỏ lớp bảo mật bổ sung khỏi tài khoản của bạn.
                                Vui lòng nhập mật khẩu để xác nhận.
                            </p>
                        </div>

                        {actionError && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{actionError}</span>
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="Nhập mật khẩu của bạn"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowDisableConfirm(false);
                                    setPassword('');
                                    setActionError('');
                                }}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDisable}
                                disabled={actionLoading || !password.trim()}
                                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                {actionLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        <span>Đang xử lý...</span>
                                    </>
                                ) : (
                                    <span>Tắt xác thực</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRegenerateConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Tạo lại mã dự phòng
                            </h3>
                            <p className="text-gray-600">
                                Điều này sẽ tạo ra bộ mã dự phòng mới và vô hiệu hóa các mã cũ.
                                Vui lòng nhập mật khẩu để xác nhận.
                            </p>
                        </div>

                        {actionError && (
                            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{actionError}</span>
                            </div>
                        )}

                        <div className="space-y-4 mb-6">
                            <label className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                                placeholder="Nhập mật khẩu của bạn"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowRegenerateConfirm(false);
                                    setPassword('');
                                    setActionError('');
                                }}
                                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleRegenerateBackupCodes}
                                disabled={actionLoading || !password.trim()}
                                className="flex-1 py-3 px-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                {actionLoading ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        <span>Đang tạo...</span>
                                    </>
                                ) : (
                                    <span>Tạo lại mã</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {newBackupCodes && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                Mã dự phòng mới
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Hãy lưu những mã này ở nơi an toàn. Bạn có thể sử dụng chúng để truy cập tài khoản nếu mất ứng dụng xác thực.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                {newBackupCodes.map((code, index) => (
                                    <div key={index} className="bg-white border border-gray-200 rounded px-3 py-2 text-sm font-mono">
                                        {code}
                                    </div>
                                ))}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => copyBackupCodes(newBackupCodes)}
                                    className="flex-1 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1 py-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Sao chép</span>
                                </button>
                                <button
                                    onClick={() => downloadBackupCodes(newBackupCodes)}
                                    className="flex-1 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center space-x-1 py-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>Tải xuống</span>
                                </button>
                            </div>
                        </div>

                        <button
                            onClick={() => setNewBackupCodes(null)}
                            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                            Hoàn tất
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}