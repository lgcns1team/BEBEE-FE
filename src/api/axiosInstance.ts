import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

// 임시 토큰 (헤더에 고정)
const TEMP_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiZWJlZSIsInN1YiI6IjEwMCIsInJvbGUiOiJESVNBQkxFRCIsImlhdCI6MTc2Nzc2NDMyMywiZXhwIjoxNzY3ODUwNzIzfQ.UXHC_jBsDqho0HuxejaKOCmuDkZF-huZDTOLeA2BMYE";

// localStorage에 토큰 강제 설정
localStorage.setItem("accessToken", TEMP_TOKEN);

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터 - 헤더에 토큰만 추가
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // localStorage에서 토큰 가져오기 (없으면 TEMP_TOKEN 사용)
    const accessToken = localStorage.getItem("accessToken") || TEMP_TOKEN;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 에러만 로깅
instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // 에러 로깅
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 인증 에러 - 토큰을 확인하세요");
    }

    return Promise.reject(error);
  }
);
