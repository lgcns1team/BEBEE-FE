import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";
import { useUserStore } from "../store/useUserStore";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터 - Zustand store에서 토큰 가져와서 헤더에 추가
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Zustand store에서 accessToken 가져오기 (AuthLoginPage 패턴과 동일)
    const accessToken = useUserStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러 처리
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // 401 에러 시 인증 실패 처리
    if (error.response?.status === 401) {
      console.warn("인증 에러 (401) - 토큰을 확인하세요");
      // 필요시 로그아웃 처리 또는 토큰 재발급 로직 추가 가능
      // const { clearAuth } = useUserStore.getState();
      // clearAuth();
    }
    return Promise.reject(error);
  }
);
