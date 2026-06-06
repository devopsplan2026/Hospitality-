import axios from 'axios';

// Single source of truth for API URL — reads from .env file
// Set REACT_APP_API_URL in your .env file for production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8083/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Global response interceptor — redirect to login on 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear();
            window.location.href = '/patient/login';
        }
        return Promise.reject(error);
    }
);

export default api;
