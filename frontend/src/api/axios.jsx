import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    // Skip adding token for public endpoints
    const isPublicProductEndpoint = config.url === '/products' ||
        (config.url.startsWith('/products/') &&
            config.url.match(/^\/products\/\d+$/) &&
            config.method.toLowerCase() === 'get');

    // Skip adding token for all auth endpoints (login, register, OTP, password reset)
    const isAuthEndpoint = config.url.startsWith('/auth/');

    if (isPublicProductEndpoint || isAuthEndpoint) {
        return config;
    }

    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;