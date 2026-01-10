import { create } from "zustand";
import type { Engagement } from "../../../types/match.type";

interface MatchState {
  engagements: Engagement[];

  setEngagements: (
    updater: Engagement[] | ((prev: Engagement[]) => Engagement[])
  ) => void;

  clearEngagements: () => void;

  getByEngagementId: (engagementId: string) => Engagement | undefined;
  getByAgreementId: (agreementId: string) => Engagement | undefined;
}

export const useMatchStore = create<MatchState>()((set, get) => ({
  engagements: [],

  setEngagements: (updater) =>
    set((state) => ({
      engagements:
        typeof updater === "function" ? updater(state.engagements) : updater,
    })),

  clearEngagements: () => set({ engagements: [] }),

  getByEngagementId: (engagementId) =>
    get().engagements.find((e) => e.engagementId === engagementId),

  getByAgreementId: (agreementId) =>
    get().engagements.find((e) => e.agreementId === agreementId),
}));
