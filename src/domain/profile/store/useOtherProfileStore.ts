// // src/store/useProfileStore.ts
// import { create } from "zustand";
// import type { MemberProfile } from "../../../types/profile.type";

// interface OtherProfileState {
//   profile: MemberProfile | null;
//   isLoading: boolean;
//   error: string | null;

//   setProfile: (profile: MemberProfile) => void;
//   clearProfile: () => void;
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
// }

// export const useOtherProfileStore = create<OtherProfileState>((set) => ({
//   profile: null,
//   isLoading: false,
//   error: null,

//   setProfile: (profile) =>
//     set({
//       profile,
//       isLoading: false,
//       error: null,
//     }),

//   clearProfile: () =>
//     set({
//       profile: null,
//       error: null,
//     }),

//   setLoading: (isLoading) => set({ isLoading }),
//   setError: (error) => set({ error, isLoading: false }),
// }));