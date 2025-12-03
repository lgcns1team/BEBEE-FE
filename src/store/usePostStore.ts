import { create } from "zustand";

export interface Post {
  id: number;
  title: string;
  location: string;
  date: string;
  honey: number;
  category: string; // 하루 도움 / 지속 도움
  done: boolean; // 매칭 완료 여부
  tags: string[];
  image?: string;
}

interface PostState {
  posts: Post[];
  setPosts: (data: Post[]) => void;
}

export const usePostStore = create<PostState>((set) => ({
  posts: [],
  setPosts: (data) => set({ posts: data }),
}));
