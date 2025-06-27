import { apiService } from './api.js';

export class UserService {
    async getCurrentUser() {
        try {
            const response = await apiService.get('/user/me');
            return response.user;
        } catch (error) {
            throw new Error(error.message || 'Failed to get current user');
        }
    }

    async getCurrentUserId() {
        try {
            const user = await this.getCurrentUser();
            return user?.id || null;
        } catch (error) {
            console.error('Error getting current user ID:', error);
            return null;
        }
    }

    async updateProfile(userData) {
        try {
            const response = await apiService.put('/user/profile', userData);
            return response.user;
        } catch (error) {
            throw new Error(error.message || 'Failed to update profile');
        }
    }

    async changePassword(passwordData) {
        try {
            const response = await apiService.post('/user/change-password', passwordData);
            return response;
        } catch (error) {
            throw new Error(error.message || 'Failed to change password');
        }
    }
}

export const userService = new UserService();