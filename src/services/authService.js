import { apiService } from './api.js';

export class AuthService {
    async register(userData) {
        try {
            const response = await apiService.post('/auth/register', userData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Registration failed');
        }
    }

    async login(credentials) {
        try {
            const response = await apiService.post('/auth/login', credentials);

            if (response.session?.access_token) {
                apiService.setToken(response.session.access_token);
            }

            return response;
        } catch (error) {
            throw new Error(error.message || 'Login failed');
        }
    }

    async logout() {
        try {
            await apiService.post('/auth/logout');
            apiService.setToken(null);
            return true;
        } catch (error) {
            apiService.setToken(null);
            throw new Error(error.message || 'Logout failed');
        }
    }

    getCurrentUser() {
        const token = localStorage.getItem('auth_token');
        return token ? { isAuthenticated: true, token } : null;
    }

    isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    }
}

export const authService = new AuthService();