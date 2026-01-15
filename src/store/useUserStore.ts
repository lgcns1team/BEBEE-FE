import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 백엔드 /api/test/me 응답 구조 (Compatible with both string/number memberId)
interface User {
  memberId: number | string;
  email: string;
  name: string;
  nickname: string;
  role: "DISABLED" | "HELPER" | "ADMIN";
  addressRoad: string;
  latitude: number;  
  longitude: number;
}

interface UserStore {
  // 상태
  user: User | null;
  accessToken: string | null;
  isLoggedIn: boolean;

  // 액션 (상태 변경만, API 호출 금지)
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  clearUser: () => void;
}

export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      user: null,
      accessToken: null,
      isLoggedIn: false,

      setUser: (user) => set({ user, isLoggedIn: true }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearUser: () =>
        set({ user: null, accessToken: null, isLoggedIn: false }),
    }),
    {
      name: "user-session", // sessionStorage 키 이름
      storage: createJSONStorage(() => sessionStorage), // 탭 닫으면 삭제되는 sessionStorage 사용 (localStorage보다 보안 우수)
      partialize: (state) =>
        ({
          user: state.user,
          isLoggedIn: state.isLoggedIn,
          accessToken: state.accessToken,
        } as any), // accessToken 제외하고 저장
    }
  )
);
