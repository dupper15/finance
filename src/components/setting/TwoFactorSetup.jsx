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
            setError('Please enter a valid 6-digit code');
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
            alert('Copied to clipboard!');
        });
    };

    const downloadBackupCodes = () => {
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

    useEffect(() => {
        if (step === 1) {
            handleSetup();
        }
    }, []);

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Setup Two-Factor Authentication</h2>
                <p className="text-gray-600 mt-2">Secure your account with an additional layer of protection</p>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {step === 1 && (
                <div className="text-center">
                    <LoadingSpinner size="lg" />
                    <p className="mt-4 text-gray-600">Setting up two-factor authentication...</p>
                </div>
            )}

            {step === 2 && setupData && (
                <div className="space-y-6">
                    <div className="text-center">
                        <p className="text-sm text-gray-600 mb-4">
                            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                        </p>
                        <div className="bg-white p-4 rounded-lg border inline-block">
                            <img
                                src={setupData.qrCodeUrl}
                                alt="QR Code for 2FA setup"
                                className="w-48 h-48"
                            />
                        </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-2">Manual entry key:</p>
                        <div className="flex items-center space-x-2">
                            <code className="flex-1 bg-white p-2 rounded border text-sm font-mono break-all">
                                {setupData.secret}
                            </code>
                            <button
                                onClick={() => copyToClipboard(setupData.secret)}
                                className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                            >
                                Copy
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Enter verification code
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
                        <h4 className="font-medium text-yellow-800 mb-2">Backup Codes</h4>
                        <p className="text-sm text-yellow-700 mb-3">
                            Save these backup codes in a safe place. You can use them to access your account if you lose your authenticator.
                        </p>
                        <div className="flex space-x-2 mb-3">
                            <button
                                onClick={() => setShowBackupCodes(!showBackupCodes)}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                            >
                                {showBackupCodes ? 'Hide' : 'Show'} Codes
                            </button>
                            <button
                                onClick={downloadBackupCodes}
                                className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                            >
                                Download
                            </button>
                        </div>
                        {showBackupCodes && (
                            <div className="bg-white p-3 rounded border">
                                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                                    {setupData.backupCodes.map((code, index) => (
                                        <div key={index} className="bg-gray-50 p-2 rounded text-center">
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
                            className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleVerify}
                            disabled={loading || verificationCode.length !== 6}
                            className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify & Enable'}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="text-center space-y-4">
                    <div className="text-green-600">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900">Two-Factor Authentication Enabled!</h3>
                    <p className="text-gray-600">
                        Your account is now protected with two-factor authentication. Make sure to save your backup codes in a safe place.
                    </p>
                    <button
                        onClick={handleComplete}
                        className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Complete Setup
                    </button>
                </div>
            )}
        </div>
    );
}