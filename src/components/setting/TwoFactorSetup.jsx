import React, { useState, useEffect } from 'react';
import { twoFactorAuthService } from '../../services/twoFactorAuthService.js';
import { LoadingSpinner } from '../ui/Loading/LoadingSpinner.js';

export function TwoFactorSetup({ onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [setupData, setSetupData] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [showBackupCodes, setShowBackupCodes] = useState(false);

    useEffect(() => {
        if (step === 1) {
            handleSetup();
        }
    }, []);

    const handleSetup = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await twoFactorAuthService.setup();
            setSetupData(data);
            setStep(2);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            setError('Vui lòng nhập mã 6 chữ số hợp lệ');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await twoFactorAuthService.verify(verificationCode);
            setStep(3);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = () => {
        onComplete?.();
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert('Đã sao chép vào clipboard!');
        });
    };

    const downloadBackupCodes = () => {
        if (!setupData?.backupCodes) return;

        const codesText = setupData.backupCodes.join('\n');
        const blob = new Blob([codesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'controle-finance-backup-codes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Thiết lập xác thực hai yếu tố</h2>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="text-center py-8">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Đang thiết lập xác thực hai yếu tố...</p>
                </div>
            )}

            {step === 2 && setupData && (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            Quét mã QR này bằng ứng dụng xác thực của bạn (Google Authenticator, Authy, v.v.)
                        </p>
                        <div className="bg-white p-4 rounded-lg border inline-block">
                            <img
                                src={setupData.qrCodeUrl}
                                alt="Mã QR để thiết lập 2FA"
                                className="w-48 h-48"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Khóa nhập thủ công:</p>
                        <div className="flex items-center space-x-2">
                            <code className="flex-1 bg-white p-2 rounded border text-sm font-mono break-all">
                                {setupData.secret}
                            </code>
                            <button
                                onClick={() => copyToClipboard(setupData.secret)}
                                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                                Sao chép
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhập mã xác minh
                        </label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                            maxLength={6}
                        />
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-800 mb-2">Mã dự phòng</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                            Lưu những mã dự phòng này ở nơi an toàn. Bạn có thể sử dụng chúng để truy cập tài khoản nếu mất ứng dụng xác thực.
                        </p>
                        <div className="flex space-x-2 mb-3">
                            <button
                                onClick={() => setShowBackupCodes(!showBackupCodes)}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                            >
                                {showBackupCodes ? 'Ẩn mã' : 'Hiện mã'}
                            </button>
                            <button
                                onClick={() => copyToClipboard(setupData.backupCodes.join('\n'))}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                            >
                                Sao chép
                            </button>
                            <button
                                onClick={downloadBackupCodes}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                            >
                                Tải xuống
                            </button>
                        </div>
                        {showBackupCodes && (
                            <div className="bg-white p-3 rounded border">
                                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                                    {setupData.backupCodes.map((code, index) => (
                                        <div key={index} className="text-center py-1">
                                            {code}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleVerify}
                            disabled={loading || !verificationCode || verificationCode.length !== 6}
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading && <LoadingSpinner size="sm" className="mr-2" />}
                            {loading ? 'Đang xác minh...' : 'Xác minh & Bật'}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="text-center space-y-4 py-4">
                    <div className="text-green-600">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Xác thực hai yếu tố đã được bật!</h3>
                    <p className="text-gray-600">
                        Tài khoản của bạn hiện được bảo vệ bằng xác thực hai yếu tố. Hãy chắc chắn lưu mã dự phòng ở nơi an toàn.
                    </p>
                    <button
                        onClick={handleComplete}
                        className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Hoàn tất thiết lập
                    </button>
                </div>
            )}
        </div>
    );
}