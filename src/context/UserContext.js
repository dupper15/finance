import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { userService } from '../services/userService.js';
import { useAuth } from './AuthContext.js';

const UserContext = createContext();

const initialState = {
    user: null,
    stats: null,
    loading: {
        user: false,
        stats: false,
        update: false
    },
    error: null
};

function userReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                loading: {
                    ...state.loading,
                    [action.payload.type]: action.payload.value
                }
            };

        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload
            };

        case 'CLEAR_ERROR':
            return {
                ...state,
                error: null
            };

        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                loading: {
                    ...state.loading,
                    user: false
                }
            };

        case 'SET_STATS':
            return {
                ...state,
                stats: action.payload,
                loading: {
                    ...state.loading,
                    stats: false
                }
            };

        case 'UPDATE_USER_SUCCESS':
            return {
                ...state,
                user: action.payload,
                loading: {
                    ...state.loading,
                    update: false
                },
                error: null
            };

        case 'CLEAR_USER':
            return initialState;

        default:
            return state;
    }
}

export function UserProvider({ children }) {
    const [state, dispatch] = useReducer(userReducer, initialState);
    const { isAuthenticated } = useAuth();

    const setLoading = (type, value) => {
        dispatch({ type: 'SET_LOADING', payload: { type, value } });
    };

    const setError = (error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    const clearError = () => {
        dispatch({ type: 'CLEAR_ERROR' });
    };

    const loadUser = async () => {
        if (!isAuthenticated) {
            dispatch({ type: 'CLEAR_USER' });
            return;
        }

        try {
            setLoading('user', true);
            const userData = await userService.getCurrentUser();
            dispatch({ type: 'SET_USER', payload: userData });
        } catch (error) {
            setError(error.message);
            setLoading('user', false);
        }
    };

    const getCurrentUserId = async () => {
        try {
            if (state.user?.id) {
                return state.user.id;
            }
            return await userService.getCurrentUserId();
        } catch (error) {
            console.error('Error getting user ID:', error);
            return null;
        }
    };

    const loadUserStats = async () => {
        if (!isAuthenticated) return;

        try {
            setLoading('stats', true);
            const stats = await userService.getUserStats();
            dispatch({ type: 'SET_STATS', payload: stats });
        } catch (error) {
            setError(error.message);
            setLoading('stats', false);
        }
    };

    const updateProfile = async (userData) => {
        try {
            setLoading('update', true);
            const updatedUser = await userService.updateProfile(userData);
            dispatch({ type: 'UPDATE_USER_SUCCESS', payload: updatedUser });
            return updatedUser;
        } catch (error) {
            setError(error.message);
            setLoading('update', false);
            throw error;
        }
    };

    const changePassword = async (passwordData) => {
        try {
            setLoading('update', true);
            const result = await userService.changePassword(passwordData);
            setLoading('update', false);
            return result;
        } catch (error) {
            setError(error.message);
            setLoading('update', false);
            throw error;
        }
    };

    const deleteAccount = async () => {
        try {
            setLoading('update', true);
            await userService.deleteAccount();
            dispatch({ type: 'CLEAR_USER' });
            return true;
        } catch (error) {
            setError(error.message);
            setLoading('update', false);
            throw error;
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            loadUser();
            loadUserStats();
        } else {
            dispatch({ type: 'CLEAR_USER' });
        }
    }, [isAuthenticated]);

    const value = {
        ...state,
        userId: state.user?.id || null,
        loadUser,
        getCurrentUserId,
        loadUserStats,
        updateProfile,
        changePassword,
        deleteAccount,
        setError,
        clearError
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}