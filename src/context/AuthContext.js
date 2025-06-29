import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService.js';
import { twoFactorAuthService } from '../services/twoFactorAuthService.js';
import { apiService } from '../services/api.js';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
    const [pendingAuth, setPendingAuth] = useState(null);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const currentUser = authService.getCurrentUser();
            if (currentUser && currentUser.isAuthenticated) {
                apiService.setToken(currentUser.token);

                try {
                    const response = await apiService.get('/user/me');
                    setUser(response.user);
                    setIsAuthenticated(true);
                    setRequiresTwoFactor(false);
                } catch (error) {
                    if (error.requiresTwoFactor) {
                        setRequiresTwoFactor(true);
                        setPendingAuth(currentUser);
                    } else {
                        await logout();
                    }
                }
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            await logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(credentials);

            if (response.session?.access_token) {
                apiService.setToken(response.session.access_token);
                const userResponse = await apiService.get('/user/me');
                setUser(userResponse.user);
                setIsAuthenticated(true);
                setRequiresTwoFactor(false);
                setPendingAuth(null);
                return userResponse;
            }
        } catch (error) {
            if (error.requiresTwoFactor) {
                if (error.session?.access_token) {
                    apiService.setToken(error.session.access_token);
                }
                setRequiresTwoFactor(true);
                setPendingAuth({
                    token: error.session?.access_token,
                    user: error.user
                });
                throw error;
            } else {
                setError(error.message);
                await logout();
                throw error;
            }
        } finally {
            setLoading(false);
        }
    };

    const verifyTwoFactor = async (token) => {
        if (!pendingAuth) {
            throw new Error('No pending authentication');
        }

        setLoading(true);
        setError('');

        try {
            await twoFactorAuthService.verifyLogin(token);
            twoFactorAuthService.setTwoFactorToken(token);

            setUser(pendingAuth.user);
            setIsAuthenticated(true);
            setRequiresTwoFactor(false);
            setPendingAuth(null);

            return { user: pendingAuth.user };
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        setError('');

        try {
            const response = await authService.register(userData);
            return response;
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await authService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setRequiresTwoFactor(false);
            setPendingAuth(null);
            setError('');
            twoFactorAuthService.clearTwoFactorToken();
            setLoading(false);
        }
    };

    const clearError = () => {
        setError('');
    };

    const refreshUser = async () => {
        try {
            const response = await apiService.get('/user/me');
            setUser(response.user);
            return response.user;
        } catch (error) {
            console.error('Failed to refresh user:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        error,
        isAuthenticated,
        requiresTwoFactor,
        pendingAuth,
        login,
        verifyTwoFactor,
        register,
        logout,
        clearError,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};