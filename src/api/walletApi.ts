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
    "/payment/wallets/honeys"
  );
  return response.data;
};

/**
 * 꿀 사용 (매칭 성사 시)
 * @param matchId 매칭 ID
 * @param useHoney 사용할 꿀 개수 (DAY일 경우 unitHoney, TERM일 경우 totalHoney)
 */
export const deductHoney = async (
  matchId: string,
  useHoney: number
): Promise<void> => {
  await instance.post<void>("/payment/wallets/usage", {
    matchId,
    useHoney,
  });
};
