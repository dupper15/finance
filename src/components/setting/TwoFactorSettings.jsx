import React, { useState, useEffect } from 'react';
import { twoFactorAuthService } from '../../services/twoFactorAuthService.js';
import { TwoFactorSetup } from './TwoFactorSetup.jsx';
import { LoadingSpinner } from '../ui/Loading/LoadingSpinner.js';

export function TwoFactorSettings() {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSetup, setShowSetup] = useState(false);
    const [showDisableConfirm, setShowDisableConfirm] = useState(false);
    const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [newBackupCodes, setNewBackupCodes] = useState(null);

    useEffect(() => {
        loadStatus();
    }, []);

    const loadStatus = async () => {
        try {
            const statusData = await twoFactorAuthService.getStatus();
            setStatus(statusData);
        } catch (error) {
            setError('Failed to load two-factor authentication status');
        } finally {
            setLoading(false);
        }
    };

    const handleSetupComplete = () => {
        setShowSetup(false);
        loadStatus();
    };

    const handleDisable = async () => {
        if (!password) {
            setError('Password is required to disable two-factor authentication');
            return;
        }

        setActionLoading(true);
        setError('');

        try {
            await twoFactorAuthService.disable(password);
            setShowDisableConfirm(false);
            setPassword('');
            loadStatus();
        } catch (error) {
            setError(error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRegenerateBackupCodes = async () => {
        if (!password) {
            setError('Password is required to regenerate backup codes');
            return;
        }

        setActionLoading(true);
        setError('');

        try {
            const result = await twoFactorAuthService.regenerateBackupCodes(password);
            setNewBackupCodes(result.backupCodes);
            setShowRegenerateConfirm(false);
            setPassword('');
            loadStatus();
        } catch (error) {
            setError(error.message);
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
        a.download = 'controle-finance-backup-codes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="bg-white shadow rounded-lg p-6">
                <LoadingSpinner size="lg" className="h-32" />
            </div>
        );
    }

    if (showSetup) {
        return (
            <TwoFactorSetup
                onComplete={handleSetupComplete}
                onCancel={() => setShowSetup(false)}
            />
        );
    }

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">
                        Add an extra layer of security to your account
                    </p>
                </div>
                <div className="flex items-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        status?.isEnabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                    }`}>
                        {status?.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {newBackupCodes && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h4 className="font-medium text-green-800 mb-2">New Backup Codes Generated</h4>
                    <p className="text-sm text-green-700 mb-3">
                        Save these new backup codes in a safe place. Your old backup codes are no longer valid.
                    </p>
                    <div className="bg-white p-3 rounded border mb-3">
                        <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                            {newBackupCodes.map((code, index) => (
                                <div key={index} className="bg-gray-50 p-2 rounded text-center">
                                    {code}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => downloadBackupCodes(newBackupCodes)}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm hover:bg-green-200"
                        >
                            Download Codes
                        </button>
                        <button
                            onClick={() => setNewBackupCodes(null)}
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded text-sm hover:bg-gray-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {!status?.isEnabled ? (
                <div className="space-y-4">
                    <p className="text-gray-600">
                        Two-factor authentication is not enabled. Enable it to add an extra layer of security to your account.
                    </p>
                    <button
                        onClick={() => setShowSetup(true)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Enable Two-Factor Authentication
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex-shrink-0">
                            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h4 className="text-sm font-medium text-green-800">
                                Two-factor authentication is enabled
                            </h4>
                            <p className="text-sm text-green-700">
                                Your account is protected with two-factor authentication.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900">Backup Codes</h4>
                            <p className="text-sm text-gray-600 mb-2">
                                You have {status?.backupCodesCount || 0} backup codes remaining
                            </p>
                            <button
                                onClick={() => setShowRegenerateConfirm(true)}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Regenerate backup codes
                            </button>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900">Security</h4>
                            <p className="text-sm text-gray-600 mb-2">
                                Enabled on {status?.verifiedAt ? new Date(status.verifiedAt).toLocaleDateString() : 'Unknown'}
                            </p>
                            <button
                                onClick={() => setShowDisableConfirm(true)}
                                className="text-sm text-red-600 hover:text-red-500"
                            >
                                Disable two-factor authentication
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDisableConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Disable Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            This will remove the extra security layer from your account. Please enter your password to confirm.
                        </p>
                        <div className="mb-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowDisableConfirm(false);
                                    setPassword('');
                                    setError('');
                                }}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDisable}
                                disabled={actionLoading || !password}
                                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading ? 'Disabling...' : 'Disable'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRegenerateConfirm && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Regenerate Backup Codes
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            This will generate new backup codes and invalidate your current ones. Please enter your password to confirm.
                        </p>
                        <div className="mb-4">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => {
                                    setShowRegenerateConfirm(false);
                                    setPassword('');
                                    setError('');
                                }}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRegenerateBackupCodes}
                                disabled={actionLoading || !password}
                                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {actionLoading ? 'Generating...' : 'Regenerate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}