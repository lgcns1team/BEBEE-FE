import { create } from "zustand";
import type { MemberProfile } from "../../../types/member.type";
import { getMemberProfile } from "../../../api/memberApi";

interface OtherMemberState {
  profile: MemberProfile | null;
  isLoading: boolean;
  error: string | null;

  fetchMemberProfile: (memberId: string | number) => Promise<void>;
  clearProfile: () => void;
}

export const useOtherMemberStore = create<OtherMemberState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  fetchMemberProfile: async (memberId) => {
    try {
      set({ isLoading: true, error: null });
      const res = await getMemberProfile(memberId);
      set({ profile: res.data, isLoading: false });
    } catch (e) {
      console.error("타인 프로필 조회 실패:", e);
      set({
        error: "프로필 정보를 불러오는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  clearProfile: () => set({ profile: null, isLoading: false, error: null }),
}));