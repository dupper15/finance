import React, { useState, useEffect } from 'react';
import { twoFactorAuthService } from '../../services/twoFactorAuthService.js';
import { LoadingSpinner } from '../ui/Loading/LoadingSpinner.js';

export function TwoFactorSetup({ onComplete, onCancel }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [setupData, setSetupData] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [showSecret, setShowSecret] = useState(false);
    const [copied, setCopied] = useState(false);

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

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    const downloadBackupCodes = () => {
        if (!setupData?.backupCodes) return;

        const codesText = setupData.backupCodes.join('\n');
        const blob = new Blob([codesText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'backup-codes.txt';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="relative">
                    <button
                        onClick={onCancel}
                        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <div className="px-8 py-6">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Thiết lập xác thực hai yếu tố
                            </h2>
                            <p className="text-gray-600">
                                Bảo vệ tài khoản của bạn với lớp bảo mật bổ sung
                            </p>
                        </div>

                        <div className="flex items-center justify-center mb-8">
                            <div className="flex items-center space-x-4">
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="text-sm font-semibold">1</span>
                                </div>
                                <div className={`w-12 h-0.5 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    <span className="text-sm font-semibold">2</span>
                                </div>
                                <div className={`w-12 h-0.5 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                    {step >= 3 ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    ) : (
                                        <span className="text-sm font-semibold">3</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start space-x-3">
                                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm">{error}</span>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="text-center space-y-6">
                                <LoadingSpinner size="lg" />
                                <p className="text-gray-600">Đang chuẩn bị thiết lập xác thực hai yếu tố...</p>
                            </div>
                        )}

                        {step === 2 && setupData && (
                            <div className="space-y-6">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Quét mã QR với ứng dụng xác thực
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-6">
                                        Sử dụng Google Authenticator, Authy, hoặc ứng dụng xác thực khác
                                    </p>
                                </div>

                                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                                    <div className="inline-block bg-white p-4 rounded-lg shadow-sm">
                                        <img
                                            src={setupData.qrCodeUrl}
                                            alt="QR Code"
                                            className="w-48 h-48 mx-auto"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-700">Khóa thiết lập thủ công:</span>
                                        <button
                                            onClick={() => setShowSecret(!showSecret)}
                                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                        >
                                            {showSecret ? 'Ẩn' : 'Hiện'}
                                        </button>
                                    </div>

                                    {showSecret && (
                                        <div className="space-y-3">
                                            <div className="bg-white border border-gray-200 rounded-lg p-3 font-mono text-sm break-all">
                                                {setupData.secret}
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(setupData.secret)}
                                                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                            >
                                                {copied ? (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        <span>Đã sao chép!</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>Sao chép</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Nhập mã xác minh từ ứng dụng của bạn:
                                    </label>
                                    <input
                                        type="text"
                                        value={verificationCode}
                                        onChange={(e) => {
                                            setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                                            if (error) setError('');
                                        }}
                                        placeholder="123456"
                                        className="block w-full text-center text-2xl tracking-widest border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        maxLength={6}
                                    />
                                </div>

                                <div className="flex space-x-3 pt-4">
                                    <button
                                        onClick={onCancel}
                                        disabled={loading}
                                        className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        onClick={handleVerify}
                                        disabled={loading || !verificationCode || verificationCode.length !== 6}
                                        className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center justify-center space-x-2"
                                    >
                                        {loading ? (
                                            <>
                                                <LoadingSpinner size="sm" />
                                                <span>Đang xác minh...</span>
                                            </>
                                        ) : (
                                            <span>Xác minh & Bật</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 py-6">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        Xác thực hai yếu tố đã được bật!
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Tài khoản của bạn hiện được bảo vệ bằng xác thực hai yếu tố.
                                    </p>
                                </div>

                                {setupData?.backupCodes && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
                                        <div className="flex items-start space-x-3">
                                            <svg className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.34 16c-.77.833-.192 2.5 1.732 2.5z" />
                                            </svg>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-medium text-amber-800 mb-3">Mã dự phòng quan trọng</h4>
                                                <p className="text-sm text-amber-700 mb-4">
                                                    Lưu những mã này ở nơi an toàn. Bạn có thể sử dụng chúng để truy cập tài khoản nếu mất ứng dụng xác thực.
                                                </p>
                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    {setupData.backupCodes.map((code, index) => (
                                                        <div key={index} className="bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-mono text-center">
                                                            {code}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex space-x-4">
                                                    <button
                                                        onClick={() => copyToClipboard(setupData.backupCodes.join('\n'))}
                                                        className="flex items-center space-x-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
                                                    >
                                                        {copied ? (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                <span>Đã sao chép!</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                                </svg>
                                                                <span>Sao chép</span>
                                                            </>
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={downloadBackupCodes}
                                                        className="flex items-center space-x-2 text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <span>Tải xuống</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleComplete}
                                    className="w-full py-3 px-6 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                                >
                                    Hoàn tất thiết lập
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}