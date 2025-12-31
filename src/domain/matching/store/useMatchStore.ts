import { create } from "zustand";
import type { Engagement } from "../../../types/match";

interface MatchState {
  engagements: Engagement[];
  setEngagements: (data: Engagement[]) => void;
  clearEngagements: () => void;
  getEngagementById: (agreementId: string) => Engagement | undefined;
}

export const useMatchStore = create<MatchState>()((set, get) => ({
  engagements: [],
  setEngagements: (data) => {
    set({ engagements: data });
  },
  clearEngagements: () => {
    set({ engagements: [] });
  },
  getEngagementById: (agreementId) => {
    return get().engagements.find((e) => e.agreementId === agreementId);
  },
}));
