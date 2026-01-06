import { instance } from "./axiosInstance";
import { AUTH_API_URLS } from "../domain/auth/auth.constants";
import type { LoginRequest, SignUpRequest } from "../domain/auth/auth.types";

// 백엔드 /api/test/me 응답 타입
export interface MyInfoResponse {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  role: string;
}

export const loginUser = async (data: LoginRequest) => {
  const response = await instance.post(AUTH_API_URLS.LOGIN, data);
  return response.data;
};

export const signUpUser = async (data: SignUpRequest) => {
  const response = await instance.post(AUTH_API_URLS.SIGN_UP, data);
  return response.data;
};

export const logoutUser = async () => {
  const response = await instance.delete(AUTH_API_URLS.LOGOUT);
  return response.data;
};

export const reissueToken = async () => {
  const response = await instance.post(AUTH_API_URLS.REISSUE);
  return response.data;
};

export const getMyInfo = async () => {
  const response = await instance.get<MyInfoResponse>(
    AUTH_API_URLS.GET_MY_INFO
  );
  return response.data;
};

export const checkEmail = async (email: string): Promise<boolean> => {
  const response = await instance.get("/member/auth/check-email", {
    params: { email },
  });
  return response.data;
};

export const checkNickname = async (nickname: string): Promise<boolean> => {
  const response = await instance.get("/member/auth/check-nickname", {
    params: { nickname },
  });
  return response.data;
};
