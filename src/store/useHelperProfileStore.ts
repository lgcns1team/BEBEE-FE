// src/store/useHelperProfileStore.ts
import { create } from "zustand";
import { profileHelperMockData } from "../domain/profile/mock/profile.helper.mock";

/* ---------- types ---------- */

export interface HelperProfile {
  id: number;
  name: string;
  nickname: string;
  sweetness: number;
  gender: string;
  age: string;
  address: string;
  mainHelps: string[];
  intro: string;
}

interface HelperProfileStore {
  profiles: HelperProfile[];
  setProfiles: (data: HelperProfile[]) => void;
  updateProfile: (id: number, data: Partial<HelperProfile>) => void;
  resetProfile: () => void;
}

/* ---------- store ---------- */

export const useHelperProfileStore = create<HelperProfileStore>((set) => ({
  profiles: profileHelperMockData,

  setProfiles: (data) => set({ profiles: data }),

  updateProfile: (id, data) =>
    set((state) => ({
      profiles: state.profiles.map((profile) =>
        profile.id === id ? { ...profile, ...data } : profile
      ),
    })),

  resetProfile: () => set({ profiles: profileHelperMockData }),
}));
