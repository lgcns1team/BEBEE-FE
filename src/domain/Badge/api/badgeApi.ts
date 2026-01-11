import { instance } from "../../../api/axiosInstance";
import type { BadgeStatusResponse } from "../types/badge.type";
export const badgeApi = {
  getBadge: async (): Promise<BadgeStatusResponse> => {
    const response = await instance.post<BadgeStatusResponse>("match/badges");
    console.log("[뱃지]:", response.data);
    return response.data;
  },
};
