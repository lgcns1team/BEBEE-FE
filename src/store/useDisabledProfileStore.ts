// src/store/useProfileStore.ts
import { create } from "zustand";
import { profileDisabledMockData } from "../domain/profile/mock/profile.disabled.mock";
import { postMockData } from "../domain/post/mock/post.mock";
import type { Post } from "./usePostStore";
/* ---------- types ---------- */

export interface Profile {
  name: string;
  nickname: string;
  image?: string;
  sweetness: number;
  gender: string;
  age: string;
  address: string;
  mainHelps: string[];
  intro: string;
  difficultyTag: string;
  difficultyDesc: string;
  helpPosts: Post[];
}

interface ProfileStore {
  profile: Profile;
  setProfile: (data: Profile) => void;
  updateProfile: (data: Partial<Profile>) => void;
  resetProfile: () => void;
}

/* ---------- store ---------- */

export const useDisabledProfileStore = create<ProfileStore>((set) => ({
  profile: profileDisabledMockData,
  post: postMockData,
  setProfile: (data) => set({ profile: data }),

  updateProfile: (data) =>
    set((state) => ({
      profile: {
        ...state.profile,
        ...data,
      },
    })),

  resetProfile: () => set({ profile: profileDisabledMockData }),
}));
