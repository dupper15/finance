import React, { useState, useRef, useEffect } from 'react';
import { twoFactorAuthService } from '../../services/twoFactorAuthService.js';
import { LoadingSpinner } from '../ui/Loading/LoadingSpinner.js';
import {useAuth} from "../../context/AuthContext";

export function TwoFactorVerification({ onSuccess, onCancel, userEmail }) {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isBackupCode, setIsBackupCode] = useState(false);
    const [backupCode, setBackupCode] = useState('');
    const inputRefs = useRef([]);
    const { verifyTwoFactor } = useAuth();

    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleCodeChange = (index, value) => {
        if (value.length > 1) return;

        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

        if (pastedData.length === 6) {
            const newCode = pastedData.split('').slice(0, 6);
            setCode(newCode);
            inputRefs.current[5]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = isBackupCode ? backupCode.trim().toUpperCase() : code.join('');

        if (!token || (isBackupCode ? token.length < 6 : token.length !== 6)) {
            setError(isBackupCode ? 'Vui lòng nhập mã dự phòng hợp lệ' : 'Vui lòng nhập đầy đủ mã 6 chữ số');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const result = await verifyTwoFactor(token);
            twoFactorAuthService.setTwoFactorToken(token);
            onSuccess?.(result);
        } catch (error) {
            setError(error.message);
            if (!isBackupCode) {
                setCode(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            } else {
                setBackupCode('');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleBackupCode = () => {
        setIsBackupCode(!isBackupCode);
        setError('');
        setCode(['', '', '', '', '', '']);
        setBackupCode('');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Xác thực hai yếu tố</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Nhập mã xác minh từ ứng dụng xác thực của bạn
                    </p>
                    {userEmail && (
                        <p className="text-sm text-gray-500 mt-1">cho {userEmail}</p>
                    )}
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}

                    {!isBackupCode ? (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                                Mã xác minh
                            </label>
                            <div className="flex justify-center space-x-3" onPaste={handlePaste}>
                                {code.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={(el) => inputRefs.current[index] = el}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="\d*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                                        disabled={loading}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã dự phòng
                            </label>
                            <input
                                type="text"
                                value={backupCode}
                                onChange={(e) => setBackupCode(e.target.value)}
                                placeholder="Nhập mã dự phòng của bạn"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-center text-lg font-mono"
                                disabled={loading}
                                autoFocus
                            />
                        </div>
                    )}

                    <div className="space-y-4">
                        <button
                            type="submit"
                            disabled={loading || (!isBackupCode && code.some(digit => !digit)) || (isBackupCode && !backupCode.trim())}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" className="text-white" />
                            ) : (
                                'Xác minh'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={toggleBackupCode}
                            className="w-full text-sm text-blue-600 hover:text-blue-500"
                            disabled={loading}
                        >
                            {isBackupCode ? 'Sử dụng mã xác thực thay thế' : 'Sử dụng mã dự phòng thay thế'}
                        </button>

                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full text-sm text-gray-600 hover:text-gray-500"
                            disabled={loading}
                        >
                            Hủy và đăng xuất
                        </button>
                    </div>
                </form>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-blue-700">
                                Không thể truy cập ứng dụng xác thực? Sử dụng mã dự phòng hoặc liên hệ hỗ trợ.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}