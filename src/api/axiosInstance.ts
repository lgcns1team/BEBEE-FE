import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

// 임시 토큰 설정 (개발/배포 환경 모두 적용)
if (!localStorage.getItem("accessToken")) {
  const TEMP_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiZWJlZSIsInN1YiI6IjEwMCIsInJvbGUiOiJESVNBQkxFRCIsImlhdCI6MTc2NzY2OTk1MiwiZXhwIjoxNzY3NzU2MzUyfQ.iy1-XQEGU_Ik5OLXoWLwQ_AlUhA6YKWXNiJs6II9Ixg";
  localStorage.setItem("accessToken", TEMP_TOKEN);
}

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터 - 헤더에 토큰만 추가
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 기본 에러 처리만
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 에러 로깅만 하고 그대로 reject
    if (error.response?.status === 401) {
      console.warn("인증 에러 (401) - 토큰을 확인하세요");
    }
    return Promise.reject(error);
  }
);
