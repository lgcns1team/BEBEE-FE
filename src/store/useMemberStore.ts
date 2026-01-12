import { create } from "zustand";
import type { Member } from "../types/member.type";
import { getMyMemberProfile } from "../api/memberApi";

interface MemberState {
  member: Member | null;
  isLoading: boolean;
  error: string | null;

  // 액션
  fetchMember: () => Promise<void>;
  setMember: (member: Member) => void;
  clearMember: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMemberStore = create<MemberState>((set) => ({
  member: null,
  isLoading: false,
  error: null,

  fetchMember: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await getMyMemberProfile();
      set({ member: response.data, isLoading: false });
    } catch (error) {
      console.error("멤버 정보 조회 실패:", error);
      set({
        error: "멤버 정보를 불러오는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  setMember: (member) => set({ member, error: null }),

  clearMember: () => set({ member: null, error: null }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
