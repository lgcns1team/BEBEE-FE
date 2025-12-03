import { create } from "zustand";

export type HelpTab = "전체" | "하루 도움" | "지속 도움";

interface SortState {
  sort: string;
  setSort: (v: string) => void;

  activeTab: HelpTab;
  setActiveTab: (tab: HelpTab) => void;

  excludeDone: boolean;
  setExcludeDone: (v: boolean) => void;
}

export const useSortStore = create<SortState>((set) => ({
  sort: "",
  setSort: (v) => set({ sort: v }),

  activeTab: "전체",
  setActiveTab: (tab) => set({ activeTab: tab }),

  excludeDone: true,
  setExcludeDone: (v) => set({ excludeDone: v }),
}));
