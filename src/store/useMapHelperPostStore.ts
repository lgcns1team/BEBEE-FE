import { create } from "zustand";

export interface Post {
  id: number;
  title: string;
  location: string;
  date: string;
  category: string;
  tags: string[];
}

interface PostState {
  posts: Post[];
}

export const useMapHelperPostStore = create<PostState>(() => ({
  posts: [
    {
      id: 1,
      title: "휠체어 이동 부탁드립니다",
      location: "장충동",
      date: "12월 25일 (화)",
      tags: ["생활 지원", "학습 지원"],
      category: "하루 도움",
    },
    {
      id: 2,
      title: "휠체어 이동 부탁드립니다",
      location: "장충동",
      date: "12월 25일 (화)",
      tags: ["생활 지원", "기타 지원"],
      category: "지속 도움",
    },
    {
      id: 3,
      title: "휠체어 이동 부탁드립니다",
      location: "장충동",
      date: "12월 25일 (화)",
      tags: ["생활 지원"],
      category: "하루 도움",
    },
    {
      id: 4,
      title: "휠체어 이동 부탁드립니다",
      location: "장충동",
      date: "12월 25일 (화)",
      tags: ["생활 지원"],
      category: "지속 도움",
    },
  ],
}));
