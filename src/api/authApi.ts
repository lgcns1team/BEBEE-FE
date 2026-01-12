import { instance } from "./axiosInstance";
import { AUTH_API_URLS } from "../domain/auth/auth.constants";
import type { LoginRequest, SignUpRequest } from "../domain/auth/auth.types";
import axios from "axios";

// 토큰 갱신 전용 인스턴스 (인터셉터 없음)
const refreshInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.be-bee.link",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
// 백엔드 /api/test/me 응답 타입
export interface MyInfoResponse {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  role: string;
  addressRoad: string;
  latitude: number;  
  longitude: number;
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
  const response = await refreshInstance.post(AUTH_API_URLS.REISSUE);
  return response.data;
};

export const getMyInfo = async () => {
  const response = await instance.get<MyInfoResponse>(
    AUTH_API_URLS.GET_MY_INFO
  );
  return response.data;
};

export const checkEmail = async (email: string): Promise<boolean> => {
  const response = await instance.get(AUTH_API_URLS.CHECK_EMAIL, {
    params: { email },
  });
  return response.data;
};

export const checkNickname = async (nickname: string): Promise<boolean> => {
  const response = await instance.get(AUTH_API_URLS.CHECK_NICKNAME, {
    params: { nickname },
  });
  return response.data;
};
