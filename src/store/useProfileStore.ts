import type { PostItem } from "./../types/post.type";
import { create } from "zustand";

import { disabledProfileMockData } from "../mock/profile/profile.mock";
import { postMockData } from "../mock/post/post.mock";
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

interface ProfileStore {
  role: Role;

  disabledProfiles: DisabledProfile[];
  helperProfiles: HelperProfile[];
  post: PostItem[];

  getProfiles: () => DisabledProfile[] | HelperProfile[];

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

  disabledProfiles: disabledProfileMockData,
  helperProfiles: helperProfileMockData,
  post: postMockData,

  getProfiles: () => {
    const { role, disabledProfiles, helperProfiles } = get();
    return role === "DISABLED" ? disabledProfiles : helperProfiles;
  },
  getUserByMemberId: (memberId) => {
    const { role, disabledProfiles, helperProfiles } = get();

    return role === "DISABLED"
      ? disabledProfiles.find((p) => p.memberId === memberId)
      : helperProfiles.find((p) => p.memberId === memberId);
  },

  setRole: (role) => set({ role }),

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
