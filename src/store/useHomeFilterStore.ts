// src/store/useHomeFilterStore.ts
import { create } from "zustand";

export type TabType = "전체" | "하루 도움" | "지속 도움";

interface HomeFilterState {
  sort: string;
  activeTab: TabType;
  excludeDone: boolean;

  setSort: (value: string) => void;
  setActiveTab: (tab: TabType) => void;
  setExcludeDone: (value: boolean) => void;
}

export const useHomeFilterStore = create<HomeFilterState>((set) => ({
  sort: "",
  activeTab: "전체",
  excludeDone: false,

  setSort: (value) => set({ sort: value }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setExcludeDone: (value) => set({ excludeDone: value }),
}));
