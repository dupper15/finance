import { apiService } from './api.js';

export class TwoFactorAuthService {
    async getStatus() {
        try {
            const response = await apiService.get('/two-factor/status');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Failed to get two-factor status');
        }
    }

    async setup() {
        try {
            const response = await apiService.post('/two-factor/setup');
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Failed to setup two-factor authentication');
        }
    }

    async verify(token) {
        try {
            const response = await apiService.post('/two-factor/verify', { token });
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Failed to verify two-factor authentication');
        }
    }

    async verifyLogin(token) {
        try {
            const response = await apiService.post('/two-factor/verify-login', { token }, {
                headers: {
                    'X-2FA-Token': token
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Failed to verify two-factor authentication');
        }
    }

    async disable(password) {
        try {
            const response = await apiService.post('/two-factor/disable', { password });
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to disable two-factor authentication');
        }
    }

    async regenerateBackupCodes(password) {
        try {
            const response = await apiService.post('/two-factor/regenerate-backup-codes', { password });
            return response.data;
        } catch (error) {
            throw new Error(error.message || 'Failed to regenerate backup codes');
        }
    }

    setTwoFactorToken(token) {
        apiService.setTwoFactorToken(token);
    }

    clearTwoFactorToken() {
        apiService.clearTwoFactorToken();
    }
}

export const twoFactorAuthService = new TwoFactorAuthService();