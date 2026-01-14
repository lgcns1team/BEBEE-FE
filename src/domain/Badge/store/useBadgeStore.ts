import { create } from "zustand";
import type { BadgeStatusItem } from "../types/badge.type";
import { getMyMemberProfile } from "../../../api/memberApi";

interface BadgeState {
  badgeStatus: BadgeStatusItem[];
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchBadgeStatus: () => Promise<void>;
  setBadgeStatus: (badgeStatus: BadgeStatusItem[]) => void;
  clearBadgeStatus: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // 헬퍼 함수
  getBadgeStatusByDisabilityId: (
    disabilityId: number
  ) => BadgeStatusItem | undefined;
}

export const useBadgeStore = create<BadgeState>((set, get) => ({
  badgeStatus: [],
  isLoading: false,
  error: null,

  fetchBadgeStatus: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getMyMemberProfile();
      const badges = response.data.badges || [];

      // Badge[]를 BadgeStatusItem[]로 변환
      // Badge 타입: { disabilityCategoryId, count, badgeCode }
      // BadgeStatusItem 타입: { disabilityCategoryIds, badge_code, count }
      const badgeStatus: BadgeStatusItem[] = badges.map((badge) => ({
        disabilityCategoryIds: [badge.disabilityCategoryId],
        badge_code: badge.badgeCode as "LEVEL_1" | "LEVEL_2" | null,
        count: badge.count,
      }));

      set({ badgeStatus, isLoading: false });
    } catch (error) {
      console.error("뱃지 정보 조회 실패:", error);
      set({
        error: "뱃지 정보를 불러오는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  setBadgeStatus: (badgeStatus) => set({ badgeStatus, error: null }),

  clearBadgeStatus: () => set({ badgeStatus: [], error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  getBadgeStatusByDisabilityId: (disabilityId: number) => {
    const { badgeStatus } = get();
    return badgeStatus.find((item) =>
      item.disabilityCategoryIds.includes(disabilityId)
    );
  },
}));
