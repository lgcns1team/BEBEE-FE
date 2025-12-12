import { create } from "zustand";

export interface Post {
  id: number;
  name: string;
  gender: string;
  age: string;
  tags: string[];
  honey: number;
}

interface PostState {
  posts: Post[];
}

export const useMapUserPostStore = create<PostState>(() => ({
  posts: [
    {
      id: 1,
      name: "어디든간다",
      gender: "여성",
      age: "50대",
      tags: ["생활 지원", "방문 목욕"],
      honey: 40.5,
    },
    {
      id: 2,
      name: "어디든간다",
      gender: "여성",
      age: "50대",
      tags: ["생활 지원"],
      honey: 40.5,
    },
    {
      id: 3,
      name: "어디든간다",
      gender: "여성",
      age: "50대",
      tags: ["방문 목욕"],
      honey: 40.5,
    },
    {
      id: 4,
      name: "어디든간다",
      gender: "여성",
      age: "50대",
      tags: ["생활 지원", "방문 목욕"],
      honey: 40.5,
    },
    {
      id: 5,
      name: "어디든간다",
      gender: "여성",
      age: "50대",
      tags: ["생활 지원", "방문 목욕"],
      honey: 40.5,
    },
    {
      id: 6,
      name: "어디든간다",
      gender: "여성",
      age: "50대",
      tags: ["생활 지원", "방문 목욕"],
      honey: 40.5,
    },
  ],
}));
