import { create } from "zustand";
import type { Engagement } from "../../../types/match.type";

interface MatchState {
  engagements: Engagement[];

  setEngagements: (
    updater: Engagement[] | ((prev: Engagement[]) => Engagement[])
  ) => void;

  clearEngagements: () => void;

  /** engagementId 기준 조회 */
  getByEngagementId: (engagementId: string) => Engagement | undefined;

  /** agreementId 기준 조회 */
  getByAgreementId: (agreementId: string) => Engagement | undefined;

  /** ✅ matchId 기준 조회 (리뷰 페이지에서 사용) */
  getByMatchId: (matchId: string) => Engagement | undefined;
}

export const useMatchStore = create<MatchState>()((set, get) => ({
  engagements: [],

  setEngagements: (updater) =>
    set((state) => ({
      engagements:
        typeof updater === "function"
          ? updater(state.engagements)
          : updater,
    })),

  clearEngagements: () => set({ engagements: [] }),

  getByEngagementId: (engagementId) =>
    get().engagements.find(
      (e) => e.engagementId === engagementId
    ),

  getByAgreementId: (agreementId) =>
    get().engagements.find(
      (e) => e.agreementId === agreementId
    ),

  getByMatchId: (matchId) =>
    get().engagements.find(
      (e) => e.matchId === matchId
    ),
}));