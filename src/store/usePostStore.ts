import { create } from "zustand";
import { postMockData } from "../mock/post/post.mock";

/* ---------- types ---------- */

export interface Post {
  postId: number;
  title: string;
  region: string;

  unitHoney?: number;
  totalHoney: number;

  type: "하루 도움" | "지속 도움";
  status: boolean; // 매칭 완료 여부

  categoryName: string[];
  imageUrl?: string;

  memberId?: number;
  content?: string;
  agreementId?: number;
  // 하루 도움
  engagementDate?: Date;
  startTime?: Date;
  endTime?: Date;

  // 지속 도움
  startDate?: Date;
  endDate?: Date;
  dayOfWeek?: Schedule[];
}

interface Schedule {
  dayOfWeek: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  startTime: string;
  endTime: string;
}

export interface PostData {
  /* 공통 */
  title?: string;
  content?: string;
  imageUrl?: string;
  categoryName?: string[];

  /* 하루 도움 */
  engagementDate?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;

  /* 지속 도움 */
  startDate?: Date | null;
  endDate?: Date | null;
  dayOfWeek?: Schedule[];
}

interface PostState {
  posts: Post[];
  postData: PostData;

  setPosts: (posts: Post[]) => void;

  setPostData: (data: PostData | ((prev: PostData) => PostData)) => void;

  resetPostData: () => void;
}

const initialPostData: PostData = {
  engagementDate: null,
  startTime: null,
  endTime: null,
  startDate: null,
  endDate: null,
  dayOfWeek: [],
};

export const usePostStore = create<PostState>((set) => ({
  posts: postMockData,
  postData: initialPostData,

  setPosts: (posts) => set({ posts }),

  setPostData: (data) =>
    set((state) => ({
      postData: typeof data === "function" ? data(state.postData) : data,
    })),

  resetPostData: () => set({ postData: initialPostData }),
}));
