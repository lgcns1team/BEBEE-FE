import { create } from "zustand";
import type { Engagement } from "../../../types/match.type";

interface MatchState {
  engagements: Engagement[];
  setEngagements: (
    updater: Engagement[] | ((prev: Engagement[]) => Engagement[])
  ) => void;
  clearEngagements: () => void;
  getEngagementByAgreementId: (agreementId: string) => Engagement | undefined;
}

export const useMatchStore = create<MatchState>()((set, get) => ({
  engagements: [],

  setEngagements: (updater) =>
    set((state) => {
      const next =
        typeof updater === "function" ? updater(state.engagements) : updater;

      return {
        engagements: next.filter((e): e is Engagement =>
          Boolean(e && e.engagementId)
        ),
      };
    }),

  clearEngagements: () => {
    set({ engagements: [] });
  },

  getEngagementByAgreementId: (agreementId) =>
    get().engagements.find((e) => e && e.agreementId === agreementId),
}));
