import { instance } from "./axiosInstance";

export interface RegisterFCMTokenRequest {
  token: string;
  deviceType: "WEB_PC" | "WEB_MOBILE" | "IOS" | "ANDROID";
}

export interface RegisterFCMTokenResponse {
  success: boolean;
  message?: string;
}

/**
 * FCM 토큰을 서버에 등록합니다.
 * @param token FCM 토큰
 * @param deviceType 디바이스 타입 (기본값: "WEB_PC")
 */
export const registerFCMToken = async (
  token: string,
  deviceType: RegisterFCMTokenRequest["deviceType"] = "WEB_PC"
): Promise<RegisterFCMTokenResponse> => {
  const requestBody = {
    token,
    deviceType,
  };

  const response = await instance.post<RegisterFCMTokenResponse>(
    "/notification/notifications/fcm/tokens",
    requestBody
  );

  return response.data;
};
