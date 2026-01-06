import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

// 개발 환경 임시 토큰 설정
if (import.meta.env.DEV && !localStorage.getItem("accessToken")) {
  const TEMP_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI3MDAiLCJpc3MiOiJiZWJlZSIsInJvbGUiOiJIRUxQRVIiLCJpYXQiOjE3Njc2MDIzODksImV4cCI6MTc2NzY4ODc4OX0.fathby5Dq_ZuZQUqfUDpowbLDJpUrokK7FrQzriGv8k";
  localStorage.setItem("accessToken", TEMP_TOKEN);
}

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청 인터셉터
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // localStorage에서 accessToken 가져오기
    const accessToken = localStorage.getItem("accessToken");

    // 토큰이 있으면 Authorization 헤더에 추가
    if (accessToken) {
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
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 오류이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 토큰 갱신 시도 (순환 참조 방지를 위해 axios 직접 사용)
        const baseURL =
          import.meta.env.VITE_API_URL || "https://api.be-bee.link";
        const refreshResponse = await axios.post(
          `${baseURL}/auth/reissue`,
          {},
          { withCredentials: true }
        );

        // 새 토큰을 localStorage에 저장
        if (refreshResponse.data?.accessToken) {
          localStorage.setItem("accessToken", refreshResponse.data.accessToken);

          // 원래 요청의 Authorization 헤더 업데이트
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.accessToken}`;

          // 원래 요청 재시도
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
