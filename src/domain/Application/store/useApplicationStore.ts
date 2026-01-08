import { create } from "zustand";
import type {
  ApplicationPost,
  Applicant,
} from "../../../types/application.type";

interface CurrentPost {
  postId: string;
  postTitle: string;
  helpCategoryIds: number[];
}

interface ApplicationState {
  posts: ApplicationPost[];
  applicants: Applicant[];
  currentPost: CurrentPost | null;

  setPosts: (posts: ApplicationPost[]) => void;
  clearPosts: () => void;
  setApplicants: (applicants: Applicant[]) => void;
  clearApplicants: () => void;
  setCurrentPost: (post: CurrentPost | null) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  posts: [],
  applicants: [],
  currentPost: null,
  setPosts: (posts) => set({ posts }),
  clearPosts: () => set({ posts: [] }),
  setApplicants: (applicants) => set({ applicants }),
  clearApplicants: () => set({ applicants: [] }),
  setCurrentPost: (post) => set({ currentPost: post }),
}));
