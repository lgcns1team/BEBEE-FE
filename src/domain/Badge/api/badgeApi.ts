import { instance } from "../../../api/axiosInstance";
import type { BadgeResponse } from "../types/badge.type";
import { getMyMemberProfile } from "../../../api/memberApi";

export const badgeApi = {
  // 기존 API 엔드포인트 사용 (서버에 별도 엔드포인트가 있는 경우)
  getBadge: async (): Promise<BadgeResponse> => {
    const response = await instance.get<BadgeResponse>("/badge");
    return response.data;
  },

  // getMyMemberProfile에서 badge 정보 가져오기
  getBadgeFromMember: async (): Promise<BadgeResponse> => {
    const response = await getMyMemberProfile();
    const badges = response.data.badges || [];

    // Badge[]를 BadgeStatusItem[]로 변환
    const badgeStatus = badges.map((badge) => ({
      disabilityCategoryIds: [badge.disabilityCategoryId],
      badge_code: badge.badgeCode as "LEVEL_1" | "LEVEL_2" | null,
      count: badge.count,
    }));

    return {
      badge_status: badgeStatus,
    };
  },
};
