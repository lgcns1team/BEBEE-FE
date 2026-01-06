import { create } from "zustand";
import type { UserRole } from "../domain/auth/auth.types";
import type { MyInfoResponse } from "../api/authApi";

interface User extends MyInfoResponse {
  role: UserRole | "ADMIN";
}

interface UserStore {
  accessToken: string | null;
  user: User | null;
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  accessToken: localStorage.getItem("accessToken"),
  user: null,

  setAccessToken: (token: string) => {
    localStorage.setItem("accessToken", token);
    set({ accessToken: token });
  },

  setUser: (user: User) => {
    set({ user });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    set({ accessToken: null, user: null });
  },
}));
