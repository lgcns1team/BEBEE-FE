// src/domain/auth/auth.constants.ts
export const AUTH_API_URLS = {
  LOGIN: "/member/auth/login",
  LOGOUT: "/member/auth/logout",
  SIGN_UP: "/member/auth/signup",
  REISSUE: "/member/auth/reissue",
  GET_MY_INFO: "/member/members/me",
  CHECK_EMAIL: "/member/auth/check-email",
  CHECK_NICKNAME: "/member/auth/check-nickname",
} as const;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
