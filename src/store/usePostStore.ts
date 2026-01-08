import { create } from "zustand";
import type { PostItem, PostsGetReqDTO, HelpType } from "../types/post.type";
import { postApi } from "../api/postApi";
import { getErrorMessage } from "../utils/error";

interface PostState {
  // 데이터
  posts: PostItem[];
  hasNext: boolean;
  nextPostId: string | null;

  // 로딩 상태
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  // 필터 및 파라미터 상태
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

export const usePostStore = create<PostState>((set, get) => ({
  // 초기 상태
  posts: [],
  hasNext: false,
  nextPostId: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  currentMemberId: "100", // 실제 사용 시에는 로그인 정보에서 가져오도록 수정 필요
  type: undefined,
  isMatched: undefined,
  filters: initialFilters,

  // [1] 첫 번째 게시글 목록 조회 (필터 변경 시 호출)
  fetchPosts: async () => {
    const { currentMemberId, type, isMatched, filters, isLoading } = get();

    // 이미 로딩 중이면 중복 요청 방지
    if (isLoading) return;

    set({ isLoading: true, error: null, posts: [], nextPostId: null });

    try {
      const response = await postApi.getPosts({
        currentMemberId,
        type,
        isMatched,
        lastPostId: undefined, // 첫 페이지는 항상 undefined
        count: 20,
        reqDTO: filters,
      });

      set({
        // response.posts가 undefined/null이거나 배열이 아니면 빈 배열로 처리
        posts: Array.isArray(response.posts) ? response.posts : [],
        hasNext: response.hasNext ?? false,
        nextPostId: response.nextPostId ?? null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "게시글이 없습니다."),
        isLoading: false,
      });
    }
  },

  // [2] 무한 스크롤 - 추가 게시글 로드
  fetchMorePosts: async () => {
    const {
      isLoadingMore,
      hasNext,
      nextPostId,
      posts,
      currentMemberId,
      type,
      isMatched,
      filters,
    } = get();

    // 더 가져올 데이터가 없거나 이미 로딩 중이면 종료
    if (isLoadingMore || !hasNext || !nextPostId) return;

    set({ isLoadingMore: true, error: null });

    try {
      const response = await postApi.getPosts({
        currentMemberId,
        type,
        isMatched,
        lastPostId: nextPostId, // 이전 응답의 nextPostId 사용
        count: 20,
        reqDTO: filters,
      });

      // 안전한 배열 처리: response.posts가 undefined/null이거나 배열이 아니면 빈 배열로 처리
      const safeNewPosts = Array.isArray(response.posts) ? response.posts : [];
      const safeExistingPosts = Array.isArray(posts) ? posts : [];

      set({
        posts: [...safeExistingPosts, ...safeNewPosts], // 기존 데이터에 추가
        hasNext: response.hasNext ?? false,
        nextPostId: response.nextPostId ?? null,
        isLoadingMore: false,
      });
    } catch (error) {
      set({
        error: getErrorMessage(error, "추가 게시글을 불러오는데 실패했습니다."),
        isLoadingMore: false,
      });
    }
  },

  // [3] 필터 변경 액션들
  setType: (type) => {
    set({ type });
    get().fetchPosts(); // 상태 변경 후 즉시 호출
  },

  setIsMatched: (isMatched) => {
    set({ isMatched });
    get().fetchPosts(); // "완료 제외" 체크 시 서버에서 새로 20개를 받아옴
  },

  setFilters: (filters) => {
    set({ filters });
    get().fetchPosts();
  },

  resetFilters: () => {
    set({
      filters: initialFilters,
      type: undefined,
      isMatched: undefined,
    });
    get().fetchPosts();
  },

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
