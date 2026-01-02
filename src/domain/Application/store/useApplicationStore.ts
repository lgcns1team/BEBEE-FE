import { create } from "zustand";
import type {
  ApplicationPost,
  Applicant,
} from "../../../types/application.type";

interface ApplicationState {
  posts: ApplicationPost[];

  applicants: Applicant[];
  setPosts: (posts: ApplicationPost[]) => void;
  clearPosts: () => void;

  setApplicants: (applicants: Applicant[]) => void;
  clearApplicants: () => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  posts: [],
  applicants: [],
  setPosts: (posts) => set({ posts }),
  clearPosts: () => set({ posts: [] }),
  setApplicants: (applicants) => set({ applicants }),
  clearApplicants: () => set({ applicants: [] }),
}));
