import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Custom config interface to support `_retry` flag
interface CustomInternalAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

let accessToken: string | null = null;

// This function gets used in authContext module to sync axios and react accessTokens
export function syncAccessToken(token: string | null) {
    accessToken = token;
}

const api = axios.create({
    baseURL: 'http://localhost:7070/api',
    withCredentials: true, // send cookies with requests
});

// Request Interceptor: attach Authorization header
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
        if (accessToken) {
            config.headers = config.headers ?? {};
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

// Response Interceptor: attempt token refresh if 401
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest =
            error.config as CustomInternalAxiosRequestConfig;

        // Skip retry for refresh endpoint itself or if already retried
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh')
        ) {
            originalRequest._retry = true;

            try {
                // Get a fresh access token using refresh token cookie
                const refreshRes = await axios.post(
                    'http://localhost:7070/api/auth/refresh',
                    {},
                    { withCredentials: true },
                );

                const newAccessToken = refreshRes.data.accessToken;

                if (newAccessToken) {
                    syncAccessToken(newAccessToken);

                    // Re-send original request with updated token
                    return axios({
                        ...originalRequest,
                        headers: {
                            ...(originalRequest.headers || {}),
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                        withCredentials: true,
                    });
                }
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        // Return error if not a retryable case
        return Promise.reject(error);
    },
);

export default api;
