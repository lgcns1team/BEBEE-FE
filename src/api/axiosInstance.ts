import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { useUserStore } from '../store/useUserStore';

// 임시 토큰 (헤더에 고정)
//export const TEMP_TOKEN =
// ;

// localStorage에 토큰 강제 설정
//localStorage.setItem("accessToken", TEMP_TOKEN);


export const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

// 토큰 갱신 중복 방지를 위한 Promise 저장소
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

const onRefreshed = (token: string | null) => {
    refreshSubscribers.forEach(callback => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string | null) => void) => {
    refreshSubscribers.push(callback);
};

// 요청 인터셉터
instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // useUserStore에서 accessToken 가져오기
        const userStore = useUserStore.getState();
        const accessToken = userStore.accessToken;

        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // 사용자가 X-Member-Id 헤더 추가를 원했으므로 여기서 설정
        if (userStore.user?.memberId != null) {
            config.headers['X-Member-Id'] = userStore.user.memberId;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);
/*
// 응답 인터셉터 - 401 에러 시 자동 토큰 갱신 (Race Condition 방지)
instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 401 에러이고, 재시도하지 않은 요청인 경우
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    // 토큰 재발급 시도 (동적 import로 순환 참조 해결)
                    const { reissueToken } = await import('./authApi');
                    const { accessToken } = await reissueToken();
                    useUserStore.getState().setAccessToken(accessToken);

                    // 대기 중인 모든 요청에 새 토큰 전달
                    onRefreshed(accessToken);

                    // 원래 요청에 새 토큰 적용 후 재시도
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    // 토큰 갱신 실패 시 로그아웃 처리
                    useUserStore.getState().clearUser();
                    // 대기 중인 모든 요청에 실패 전달
                    onRefreshed(null);
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            } else {
                // 이미 토큰 갱신 중이면 대기열에 추가
                return new Promise((resolve, reject) => {
                    addRefreshSubscriber((token: string | null) => {
                        if (!token) {
                            reject(new Error('Token refresh failed'));
                            return;
                        }
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(instance(originalRequest));
                    });
                });
            }
        }

        return Promise.reject(error);
    }
);
*/