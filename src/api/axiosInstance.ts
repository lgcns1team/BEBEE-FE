import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

// 개발 환경 임시 토큰 설정
if (import.meta.env.DEV && !localStorage.getItem("accessToken")) {
  // 장애인용 토큰
  const TEMP_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiZWJlZSIsInN1YiI6IjEwMCIsInJvbGUiOiJESVNBQkxFRCIsImlhdCI6MTc2NzY2OTk1MiwiZXhwIjoxNzY3NzU2MzUyfQ.iy1-XQEGU_Ik5OLXoWLwQ_AlUhA6YKWXNiJs6II9Ixg";
  localStorage.setItem("accessToken", TEMP_TOKEN);

  // 도우미용 토큰
  // const TEMP_TOKEN =
  //   "eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJiZWJlZSIsInN1YiI6IjcwMCIsInJvbGUiOiJIRUxQRVIiLCJpYXQiOjE3Njc2NzE3MTAsImV4cCI6MTc2Nzc1ODExMH0.ngF_z3l9OidrqOvC3mIxNPl363LeNTHZY_pT8cjb0h0";
  // localStorage.setItem("accessToken", TEMP_TOKEN);
}

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
  headers: {
    "Content-Type": "application/json",
  },

  // withCredentials: true,
});

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
    // 개발 환경에서는 토큰 갱신 로직 비활성화
    if (import.meta.env.DEV) {
      console.warn(
        "API 에러 (개발 환경 - 토큰 갱신 비활성화):",
        error.response?.status,
        error.message
      );
      return Promise.reject(error);
    }

    // 프로덕션 환경에서만 토큰 갱신 로직 실행
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
        // 토큰 갱신 실패 시 로그인 페이지로 리다이렉트 -> 현재 Login이 없으므로 home으로
        localStorage.removeItem("accessToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
