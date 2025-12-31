// store.ts
import { create } from "zustand";
import type { PostItem, PostsGetReqDTO, HelpType } from "../types/post.type";
import { postApi } from "../api/postApi.1";

interface Post {
  // 데이터
  posts: PostItem[];
  hasNext: boolean;
  nextPostId: string | null;

  // 로딩 상태
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // 필터 상태
  currentMemberId: string;
  type: HelpType | undefined;
  isMatched: boolean | undefined;
  filters: PostsGetReqDTO;

  // 액션
  fetchPosts: () => Promise<void>;
  fetchMorePosts: () => Promise<void>;
  setType: (type: HelpType | undefined) => void;
  setIsMatched: (isMatched: boolean | undefined) => void;
  setFilters: (filters: PostsGetReqDTO) => void;
  resetFilters: () => void;
  reset: () => void;
}

const initialFilters: PostsGetReqDTO = {};

export const usePostStore = create<Post>((set, get) => ({
  // 초기 상태
  posts: [],
  hasNext: false,
  nextPostId: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  currentMemberId: "100",
  type: undefined,
  isMatched: undefined,
  filters: initialFilters,

  // 첫 번째 게시글 목록 조회
  fetchPosts: async () => {
    const state = get();

    set({ isLoading: true, error: null });

    try {
      const response = await postApi.getPosts({
        currentMemberId: state.currentMemberId,
        type: state.type,
        isMatched: state.isMatched,
        lastPostId: undefined,
        count: 20,
        reqDTO: state.filters, // 빈 객체 또는 필터가 적용된 객체
      });

      set({
        posts: response.posts,
        hasNext: response.hasNext,
        nextPostId: response.nextPostId,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "게시글을 불러오는데 실패했습니다.",
        isLoading: false,
      });
    }
  },

  // 무한 스크롤 - 추가 게시글 로드
  fetchMorePosts: async () => {
    const state = get();

    if (state.isLoadingMore || !state.hasNext) return;

    set({ isLoadingMore: true, error: null });

    try {
      const response = await postApi.getPosts({
        currentMemberId: state.currentMemberId,
        type: state.type,
        isMatched: state.isMatched,
        lastPostId: state.nextPostId || undefined,
        count: 20,
        reqDTO: state.filters,
      });

      set({
        posts: [...state.posts, ...response.posts],
        hasNext: response.hasNext,
        nextPostId: response.nextPostId,
        isLoadingMore: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "게시글을 불러오는데 실패했습니다.",
        isLoadingMore: false,
      });
    }
  },

  // 도움 타입 설정 (탭 클릭 시)
  setType: (type) => {
    set({ type });
    get().fetchPosts();
  },

  // 매칭 여부 설정 (버튼 클릭 시)
  setIsMatched: (isMatched) => {
    set({ isMatched });
    get().fetchPosts();
  },

  // 필터 설정
  setFilters: (filters) => {
    set({ filters });
    get().fetchPosts();
  },

  // 필터 초기화
  resetFilters: () => {
    set({ filters: initialFilters });
    get().fetchPosts();
  },

  // 전체 상태 초기화
  reset: () => {
    set({
      posts: [],
      hasNext: false,
      nextPostId: null,
      isLoading: false,
      isLoadingMore: false,
      error: null,
      type: undefined,
      isMatched: undefined,
      filters: initialFilters,
    });
  },
}));
