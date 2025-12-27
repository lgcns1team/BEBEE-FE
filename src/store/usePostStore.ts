import { create } from "zustand";
import { postMockData } from "../mock/post/post.mock";

export interface Post {
  id: number;
  title: string;
  location: string;
  dates?: string[];
  honey?: number;
  category?: string; // 하루 도움 / 지속 도움
  done?: boolean; // 매칭 완료 여부
  tags: string[];
  image?: string;
  user?: string;
  description?: string;
  // 하루도움
  time?: string;
  // 지속도움
  schedule?: string[];
  detailPlace?: string;
  // startTime: Date;
  // endTime: Date;
}

export interface WeekSchedule {
  day: string;
  start: Date | null;
  end: Date | null;
}

export interface PostData {
  // 기본 정보
  title?: string;
  tags?: string[];
  image?: string;

  // 하루 도움용
  oneDayDate?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;

  // 지속 도움용
  periodStart: Date | null;
  periodEnd: Date | null;
  weeks: WeekSchedule[];
}

interface PostState {
  posts: Post[];
  setPosts: (data: Post[]) => void;
  postData: PostData;
  setPostData: (data: PostData | ((prev: PostData) => PostData)) => void;
  resetPostData: () => void;
}

const initialPostData: PostData = {
  oneDayDate: null,
  startTime: null,
  endTime: null,
  periodStart: null,
  periodEnd: null,
  weeks: [],
};

export const usePostStore = create<PostState>((set) => ({
  posts: postMockData,
  setPosts: (data) => set({ posts: data }),
  postData: initialPostData,
  setPostData: (data) =>
    set((state) => ({
      postData: typeof data === "function" ? data(state.postData) : data,
    })),
  resetPostData: () => set({ postData: initialPostData }),
}));
