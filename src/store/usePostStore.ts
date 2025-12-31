import { create } from "zustand";
import type { PostItem, GetPostsRequest } from "../types/post.type";
import { postApi } from "../api/postApi";

// 1. 서버가 요구하는 reqDTO 구조에 맞춘 기본 필터 값 정의
// 필수 파람이므로 모든 필드를 서버가 허용하는 '전체' 혹은 '기본' 값으로 채웁니다.
const INITIAL_FILTERS: Omit<
  GetPostsRequest,
  "currentMemberId" | "lastPostId" | "count"
> = {
  legalDongCodes: [],
  helpCategories: [],
  gender: undefined,
  minHoney: 0,
  maxHoney: 10000,
  disabilityCategoryId: undefined,
  days: [],
  type: undefined,
  isMatched: null,
};

type PostFilters = typeof INITIAL_FILTERS;

interface PostState {
  posts: PostItem[];
  hasNext: boolean;
  lastPostId: string | null;
  isLoading: boolean;
  filters: PostFilters;

  // Actions
  setFilters: (newFilters: Partial<PostFilters>) => void;
  fetchPosts: (isInitial?: boolean) => Promise<void>;
  resetFilters: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
  posts: [],
  hasNext: true,
  lastPostId: null,
  isLoading: false,
  filters: INITIAL_FILTERS,

  setFilters: (newFilters) => {
    // 기존 필터와 새로운 필터를 병합하여 필수 파라미터 누락을 방지합니다.
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      posts: [],
      lastPostId: null,
      hasNext: true,
    }));
  },

  resetFilters: () => {
    // 빈 객체가 아닌 초기 정의된 유효 객체로 리셋합니다.
    set({
      filters: INITIAL_FILTERS,
      posts: [],
      lastPostId: null,
      hasNext: true,
    });
  },

  fetchPosts: async (isInitial = false) => {
    const { isLoading, hasNext, lastPostId, filters, posts } = get();

    if (isLoading || (!isInitial && !hasNext)) return;

    set({ isLoading: true });

    try {
      const currentId = "100"; // 실제 구현 시 authStore 등에서 가져옴

      // 전개 연산자(...filters)를 통해 모든 필수 파라미터가 서버로 전송됩니다.
      const response = await postApi.getPosts({
        currentMemberId: currentId,
        lastPostId: isInitial ? null : lastPostId,
        count: 20,
        ...filters,
      });

      set({
        posts: isInitial ? response.posts : [...posts, ...response.posts],
        hasNext: response.hasNext,
        lastPostId: response.nextPostId,
        isLoading: false,
      });
    } catch (error) {
      console.error("게시글 로딩 실패:", error);
      set({ isLoading: false, hasNext: false });
    }
  },
}));
