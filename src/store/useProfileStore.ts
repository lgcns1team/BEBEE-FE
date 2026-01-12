import { create } from "zustand";
import type { MyProfile } from "../types/member.type";

interface ProfileState {
  profile: MyProfile | null;
  isLoading: boolean;
  error: string | null;

  setProfile: (profile: MyProfile) => void;
  clearProfile: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  profile: null,
  isLoading: false,
  error: null,

  setProfile: (profile) => set({ profile, error: null }),
  clearProfile: () => set({ profile: null }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
