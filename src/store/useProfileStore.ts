import type { PostItem } from "./../types/post.type";
import { create } from "zustand";

import { disabledProfileMockData } from "../mock/profile/profile.mock";
import { helperProfileMockData } from "../mock/profile/profile.mock";
/* ---------- types ---------- */

export type Role = "DISABLED" | "HELPER";

export interface DisabledProfile {
  memberId: number;
  name?: string;
  nickname?: string;
  profileImageUrl?: string;
  gender?: string;
  age?: string;
  addressRoad?: string;
  helpType?: string[];
  introduction?: string;
  disabilityType?: string;
  description?: string;
  helpRequestPost?: PostItem[];
  receivedReviews?: string[];
}

export interface HelperProfile {
  memberId: number;
  name: string;
  nickname?: string;
  profileImageUrl?: string;
  gender?: string;
  age?: string;
  addressRoad?: string;
  helpType?: string[];
  introduction?: string;
  receivedReviews?: string[];
}

/* ---------- store ---------- */

/* ---------- store ---------- */

interface ProfileStore {
  role: Role;
  posts: PostItem[]; // s를 붙여서 통일 (보통 복수형을 씁니다)
  disabledProfiles: DisabledProfile[];
  helperProfiles: HelperProfile[];

  getProfiles: () => DisabledProfile[] | HelperProfile[];
  fetchPosts: () => Promise<void>;
  setRole: (role: Role) => void;

  setDisabledProfiles: (data: DisabledProfile[]) => void;
  updateDisabledProfile: (id: number, data: Partial<DisabledProfile>) => void;
  resetDisabledProfiles: () => void;

  setHelperProfiles: (data: HelperProfile[]) => void;
  updateHelperProfile: (id: number, data: Partial<HelperProfile>) => void;
  resetHelperProfiles: () => void;
  getUserByMemberId: (
    memberId?: number
  ) => DisabledProfile | HelperProfile | undefined;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  role: "DISABLED",
  posts: [],
  disabledProfiles: disabledProfileMockData,
  helperProfiles: helperProfileMockData,

  getProfiles: () => {
    const { role, disabledProfiles, helperProfiles } = get();
    return role === "DISABLED" ? disabledProfiles : helperProfiles;
  },

  getUserByMemberId: (memberId) => {
    if (!memberId) return undefined;
    const { disabledProfiles, helperProfiles } = get();

    // 팁: role에 가두지 말고 전체에서 찾는 것이 보통 더 안전합니다.
    return (
      disabledProfiles.find((p) => p.memberId === memberId) ||
      helperProfiles.find((p) => p.memberId === memberId)
    );
  },

  setRole: (role) => set({ role }),

  // 인터페이스에 정의된 메서드 구현 추가
  fetchPosts: async () => {
    try {
      // 여기에 API 호출 로직 추가
      // const data = await postService.getPosts(...);
      // set({ posts: data });
    } catch (error) {
      console.error(error);
    }
  },

  setDisabledProfiles: (data) => set({ disabledProfiles: data }),
  updateDisabledProfile: (id, data) =>
    set((state) => ({
      disabledProfiles: state.disabledProfiles.map((p) =>
        p.memberId === id ? { ...p, ...data } : p
      ),
    })),
  resetDisabledProfiles: () =>
    set({ disabledProfiles: disabledProfileMockData }),

  setHelperProfiles: (data) => set({ helperProfiles: data }),
  updateHelperProfile: (id, data) =>
    set((state) => ({
      helperProfiles: state.helperProfiles.map((p) =>
        p.memberId === id ? { ...p, ...data } : p
      ),
    })),
  resetHelperProfiles: () => set({ helperProfiles: helperProfileMockData }),
}));
