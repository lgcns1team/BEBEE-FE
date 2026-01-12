import { create } from "zustand";
import type { AgreementRequest, AgreementResponse } from "../types/match.types";
import { createAgreement } from "../../../api/matchApi";

interface AgreementState {
  isLoading: boolean;
  agreementResponse: AgreementResponse | null;
  agreementRequest: AgreementRequest | null;
  postAgreement: (data: AgreementRequest) => Promise<AgreementResponse>;
  clearAgreement: () => void;
}

export const useAgreementStore = create<AgreementState>((set) => ({
  isLoading: false,
  agreementResponse: null,
  agreementRequest: null,
  postAgreement: async (data) => {
    set({ isLoading: true });
    try {
      const result = await createAgreement(data);
      // 응답뿐만 아니라 보냈던 data(Request)도 함께 저장
      set({
        agreementResponse: result,
        agreementRequest: data,
      });
      return result;
    } finally {
      set({ isLoading: false });
    }
  },
  clearAgreement: () => {
    set({ agreementResponse: null, agreementRequest: null });
  },
}));
