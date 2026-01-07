import { create } from 'zustand';

// 백엔드 /api/test/me 응답 구조 (Compatible with both string/number memberId)
interface User {
    memberId: number | string;
    email: string;
    name: string;
    nickname: string;
    role: 'DISABLED' | 'HELPER' | 'ADMIN';
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

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    accessToken: null,
    isLoggedIn: false,

    setUser: (user) => set({ user, isLoggedIn: true }),
    setAccessToken: (token) => set({ accessToken: token }),
    clearUser: () => set({ user: null, accessToken: null, isLoggedIn: false }),
}));
