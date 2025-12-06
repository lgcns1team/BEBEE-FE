import { create } from "zustand";

export type HelpTab = "전체" | "하루 도움" | "지속 도움";

interface TabState {
  activeTab: HelpTab;
  setActiveTab: (tab: HelpTab) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: "전체",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
