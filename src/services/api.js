class ApiService {
    constructor() {
        this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
        this.token = null;
        this.twoFactorToken = null;
        this.initializeToken();
    }

    initializeToken() {
        this.token = localStorage.getItem('auth_token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    setTwoFactorToken(token) {
        this.twoFactorToken = token;
    }

    clearTwoFactorToken() {
        this.twoFactorToken = null;
    }

    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers.Authorization = `Bearer ${this.token}`;
        }

        if (this.twoFactorToken) {
            headers['X-2FA-Token'] = this.twoFactorToken;
        }

        return headers;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 403 && data.requiresTwoFactor) {
                    const error = new Error(data.error || 'Two-factor authentication required');
                    error.requiresTwoFactor = true;
                    error.status = 403;
                    error.user = data.user;
                    error.session = data.session;
                    throw error;
                }

                if (response.status === 401) {
                    this.setToken(null);
                    this.clearTwoFactorToken();
                    window.location.href = '/login';
                    return;
                }

                throw new Error(data.error || data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                throw new Error('Network error. Please check your connection.');
            }
            throw error;
        }
    }

    async get(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'GET',
            ...options,
        });
    }

    async post(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : null,
            ...options,
        });
    }

    async put(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : null,
            ...options,
        });
    }

    async patch(endpoint, data = null, options = {}) {
        return this.request(endpoint, {
            method: 'PATCH',
            body: data ? JSON.stringify(data) : null,
            ...options,
        });
    }

    async delete(endpoint, options = {}) {
        return this.request(endpoint, {
            method: 'DELETE',
            ...options,
        });
    }
}

export const apiService = new ApiService();