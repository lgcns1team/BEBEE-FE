// // src/store/useProfileStore.ts
// import { create } from "zustand";
// import type { MemberProfile } from "../../../types/profile.type";

// interface OtherProfileState {
//   profile: MemberProfile | null;
//   isLoading: boolean;
//   error: string | null;

//   setProfile: (profile: MemberProfile) => void;
//   clearProfile: () => void;
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
// }

// export const useOtherProfileStore = create<OtherProfileState>((set) => ({
//   profile: null,
//   isLoading: false,
//   error: null,

//   setProfile: (profile) =>
//     set({
//       profile,
//       isLoading: false,
//       error: null,
//     }),

//   clearProfile: () =>
//     set({
//       profile: null,
//       error: null,
//     }),

//   setLoading: (isLoading) => set({ isLoading }),
//   setError: (error) => set({ error, isLoading: false }),
// }));

import { create } from "zustand";
import type { MemberProfile } from "../../../types/member.type";
import { getMemberProfile } from "../../../api/memberApi";

interface OtherMemberState {
  /** 타인이 보는 프로필 */
  profile: MemberProfile | null;

  /** 로딩 상태 */
  isLoading: boolean;

  /** 에러 메시지 */
  error: string | null;

  /** 특정 memberId의 프로필 조회 */
  fetchMemberProfile: (memberId: string | number) => Promise<void>;

  /** 상태 초기화 */
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

      set({
        profile: res.data,
        isLoading: false,
      });
    } catch (e) {
      console.error("타인 프로필 조회 실패:", e);
      set({
        error: "프로필 정보를 불러오는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  clearProfile: () =>
    set({
      profile: null,
      isLoading: false,
      error: null,
    }),
}));