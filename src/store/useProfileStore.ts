// src/store/useProfileStore.ts
import { create } from "zustand";
import { profileMockData } from "../domain/profile/mock/profile.mock";
export interface HelpPost {
  id: number;
  title: string;
  honey: number;
  location: string;
  status?: "done" | "open";
  image?: string;
}

export interface ProfileState {
  name: string;
  nickname: string;
  sweetness: number;
  gender: string;
  age: string;
  address: string;
  mainHelps: string[];
  intro: string;
  difficultyTag: string;
  difficultyDesc: string;
  helpPosts: HelpPost[];
}

export const useProfileStore = create<ProfileState>(() => ({
  ...profileMockData,
}));
