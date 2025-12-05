import { create } from "zustand";

export interface Post {
  id: number;
  title: string;
  user: string;
  location: string;
  date: string;
  category: "하루 도움" | "지속 도움";
  tags: string[];
  done?: boolean;
  image?: string;
}

interface PostState {
  posts: Post[];
}

export const useMatchPostStore = create<PostState>(() => ({
  posts: [
    {
      id: 1,
      title: "굿모닝 마트에서 한우 육회 1++",
      user: "박위",
      location: "장충동",
      date: "11월 30일 (화)",
      category: "하루 도움",
      tags: ["생활 지원"],
      done: false,
    },
    {
      id: 2,
      title: "마라톤 보조해주실 분 구합니다.",
      user: "낭만러너",
      location: "난지한강공원",
      date: "월요일, 수요일",
      category: "하루 도움",
      tags: ["이동 지원", "생활 지원"],
      image: "",
    },
    {
      id: 3,
      title: "매주 2회 식사 보조 가능한 분 찾습니다",
      user: "홍길동",
      location: "연남동",
      date: "매주 화, 금",
      category: "지속 도움",
      tags: ["식사 도움"],
    },
  ],
}));
