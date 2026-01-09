import { create } from "zustand";

export type ToastType = "SUCCESS" | "ERROR";

interface ToastStore {
  message: string | null;
  type: ToastType;
  showToast: (msg: string, type?: ToastType) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  message: null,
  type: "SUCCESS", // 기본값
  showToast: (msg, type = "SUCCESS") => {
    set({ message: msg, type });

    setTimeout(() => {
      set({ message: null });
    }, 2500);
  },
}));
