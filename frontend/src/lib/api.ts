import axios from 'axios';
import { appConfig } from '../config/app.config';
import { useAuthStore } from '../store/authStore';

export const api = axios.create({
    baseURL: appConfig.apiBaseUrl,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    if (config.headers && typeof config.headers.set === 'function') {
        config.headers.set('x-tenant-id', appConfig.tenantId);
    } else {
        config.headers['x-tenant-id'] = appConfig.tenantId;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 Unauthorized and we haven't already tried to refresh
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = useAuthStore.getState().refreshToken;
                if (!refreshToken) throw new Error('No refresh token');

                const { data } = await axios.post(`${appConfig.apiBaseUrl}/auth/refresh/`, { refreshToken });

                useAuthStore.getState().setTokens(data.accessToken, data.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                return api(originalRequest);
            } catch (refreshError) {
                useAuthStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
