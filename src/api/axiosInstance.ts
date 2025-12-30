import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';

export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8083',
    timeout: 30000, // 30초
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 요청 인터셉터
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
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
