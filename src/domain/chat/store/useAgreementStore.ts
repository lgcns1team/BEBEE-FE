import { create } from "zustand";
import type { AgreementRequest } from "../agreement.types";
import { createAgreement } from "../api/agreementApi";

interface AgreementState {
  isLoading: boolean;
  postAgreement: (data: AgreementRequest) => Promise<any>;
}

export const useAgreementStore = create<AgreementState>((set) => ({
  isLoading: false,
  postAgreement: async (data) => {
    set({ isLoading: true });
    try {
      const result = await createAgreement(data);
      return result;
    } finally {
      set({ isLoading: false });
    }
  },
}));
