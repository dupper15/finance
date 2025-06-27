import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService.js';
import { useAuth } from '../context/AuthContext.js';

export function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { isAuthenticated } = useAuth();

    const loadUser = useCallback(async () => {
        if (!isAuthenticated) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const userData = await userService.getCurrentUser();
            setUser(userData);
        } catch (err) {
            setError(err.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const getCurrentUserId = useCallback(async () => {
        try {
            return await userService.getCurrentUserId();
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    }, []);

    const updateProfile = useCallback(async (userData) => {
        try {
            setLoading(true);
            const updatedUser = await userService.updateProfile(userData);
            setUser(updatedUser);
            return updatedUser;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const changePassword = useCallback(async (passwordData) => {
        try {
            setLoading(true);
            const result = await userService.changePassword(passwordData);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    return {
        user,
        userId: user?.id || null,
        loading,
        error,
        getCurrentUserId,
        updateProfile,
        changePassword,
        refetch: loadUser,
    };
}