import { userService } from '../services/userService.js';

export const getCurrentUserId = async () => {
    try {
        return await userService.getCurrentUserId();
    } catch (error) {
        console.error('Error getting current user ID:', error);
        return null;
    }
};

export const getCurrentUser = async () => {
    try {
        return await userService.getCurrentUser();
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
};

export const getUserDisplayName = (user) => {
    if (!user) return 'Unknown User';
    return user.user_metadata?.name || user.email || 'User';
};

export const getUserInitials = (user) => {
    if (!user) return 'U';

    const name = user.user_metadata?.name;
    if (name) {
        return name
            .split(' ')
            .map(part => part.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    }

    return user.email?.charAt(0).toUpperCase() || 'U';
};

export const isUserEmailVerified = (user) => {
    return user?.email_confirmed_at != null;
};

export const formatUserCreatedDate = (user) => {
    if (!user?.created_at) return 'Unknown';

    return new Date(user.created_at).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};