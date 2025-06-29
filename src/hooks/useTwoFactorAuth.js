import { useState, useEffect } from 'react';
import { twoFactorAuthService } from '../services/twoFactorAuthService.js';

export const useTwoFactorAuth = () => {
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadStatus = async () => {
        try {
            setLoading(true);
            setError('');
            const statusData = await twoFactorAuthService.getStatus();
            setStatus(statusData);
        } catch (error) {
            setError(error.message);
            console.error('Error loading 2FA status:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStatus();
    }, []);

    const setup = async () => {
        try {
            setError('');
            const result = await twoFactorAuthService.setup();
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const verify = async (token) => {
        try {
            setError('');
            const result = await twoFactorAuthService.verify(token);
            await loadStatus();
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const verifyLogin = async (token) => {
        try {
            setError('');
            const result = await twoFactorAuthService.verifyLogin(token);
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const disable = async (password) => {
        try {
            setError('');
            const result = await twoFactorAuthService.disable(password);
            await loadStatus();
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const regenerateBackupCodes = async (password) => {
        try {
            setError('');
            const result = await twoFactorAuthService.regenerateBackupCodes(password);
            await loadStatus();
            return result;
        } catch (error) {
            setError(error.message);
            throw error;
        }
    };

    const clearError = () => {
        setError('');
    };

    const refresh = () => {
        loadStatus();
    };

    return {
        status,
        loading,
        error,
        setup,
        verify,
        verifyLogin,
        disable,
        regenerateBackupCodes,
        clearError,
        refresh,
        isEnabled: status?.isEnabled || false,
        isSetup: status?.isSetup || false,
        backupCodesCount: status?.backupCodesCount || 0
    };
};