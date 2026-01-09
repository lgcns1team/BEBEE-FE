import { create } from "zustand";

interface WalletStore {
  currentHoney: number;
  setCurrentHoney: (currentHoney: number) => void;
  clearCurrentHoney: () => void;
}

export const useWalletStore = create<WalletStore>((set) => ({
  currentHoney: 0,
  setCurrentHoney: (currentHoney) => set({ currentHoney }),
  clearCurrentHoney: () => set({ currentHoney: 0 }),
}));
