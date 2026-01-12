export const AUTH_API_URLS = {
  LOGIN: "/api/members/auth/login",
  SIGN_UP: "/api/members/auth/signup",
  REISSUE: "/api/members/auth/reissue",
  LOGOUT: "/api/members/auth/logout",
  GET_MY_INFO: "/api/members/me",
  CHECK_EMAIL: "/api/members/auth/check-email",
  CHECK_NICKNAME: "/api/members/auth/check-nickname",
} as const;

export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
export const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
