import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { useUserStore } from '../store/useUserStore';

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 요청 인터셉터
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // useUserStore에서 accessToken 가져오기
        const userStore = useUserStore.getState();
        const accessToken = userStore.accessToken;

        if (accessToken) {
            if (!config.headers) {
                config.headers = {} as any;
            }
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터
instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
