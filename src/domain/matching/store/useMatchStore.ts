import { create } from "zustand";
import { agreementMockData } from "../mock/match.mock";
import type { Agreement } from "../match.types";

interface MatchState {
  agreements: Agreement[];
  getAgreementById: (id: number) => Agreement | undefined;
  getAgreementByPostId: (postId: number) => Agreement | undefined;
}

export const useMatchStore = create<MatchState>()((set, get) => ({
  agreements: agreementMockData,

  getAgreementById: (id) => get().agreements.find((a) => a.agreementId === id),

  getAgreementByPostId: (postId) =>
    get().agreements.find((a) => a.postId === postId),
}));
