import { instance } from "./axiosInstance";

export interface GetHoneyResponse {
  currentHoney: number;
}

/**
 * 현재 꿀 잔액 조회
 * @returns 현재 보유 꿀 개수
 */
export const getCurrentHoney = async (): Promise<GetHoneyResponse> => {
  const response = await instance.get<GetHoneyResponse>(
    "payment/wallets/honeys"
  );
  return response.data;
};
