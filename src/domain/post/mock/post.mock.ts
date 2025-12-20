import type { Post } from "../../../store/usePostStore";

export const postMockData: Post[] = [
  {
    id: 1,
    title: "상체 운동 PT해주실 분 구합니다",
    location: "장충동",
    date: "11월 30일 (화)",
    honey: 300,
    category: "하루 도움",
    done: false,
    tags: ["이동 지원", "생활 지원"],
    image: "",
  },
  {
    id: 2,
    title: "굿모닝 마트에서 한우 육회 1++",
    location: "장충동",
    date: "11월 30일 (화)",
    honey: 200,
    category: "하루 도움",
    done: true,
    tags: ["생활 지원"],
  },
  {
    id: 3,
    title: "굿모닝 마트에서 한우 육회 1++",
    location: "장충동",
    date: "월요일, 수요일",
    honey: 200,
    category: "지속 도움",
    done: true,
    tags: ["생활 지원"],
  },
];
