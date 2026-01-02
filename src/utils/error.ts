// utils/error.ts
import axios from "axios";

export const getErrorMessage = (error: unknown, fallback: string): string => {
  // 1. Axios 에러인 경우 (서버 응답 메시지 우선)
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || fallback;
  }

  // 2. 일반 Error 객체인 경우
  if (error instanceof Error) {
    return error.message;
  }

  // 3. 그 외 알 수 없는 경우
  return fallback;
};
