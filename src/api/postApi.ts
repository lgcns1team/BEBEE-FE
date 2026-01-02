import { instance } from "./axiosInstance";
import type {
  GetPostsRequest,
  GetPostsResponse,
  PostCreateReqDTO,
} from "../types/post.type";

export const postApi = {
  /**
   * 게시글 목록 조회 API
   */
  getPosts: async (params: GetPostsRequest): Promise<GetPostsResponse> => {
    const {
      currentMemberId,
      type,
      isMatched,
      lastPostId,
      count = 20,
      reqDTO,
    } = params;

    // 쿼리 파라미터 구성
    const queryParams: Record<string, any> = {
      currentMemberId,
      count,
      ...reqDTO, // reqDTO를 객체 자체로 전달
    };

    // type이 있을 경우만 추가
    if (type) {
      queryParams.type = type;
    }

    // isMatched가 명시적으로 false일 때만 추가
    if (isMatched === false) {
      queryParams.isMatched = false;
    }

    // lastPostId가 있을 경우 추가 (무한 스크롤)
    if (lastPostId) {
      queryParams.lastPostId = lastPostId;
    }

    const response = await instance.get<GetPostsResponse>("/posts", {
      params: queryParams,
    });

    return response.data;
  },

  createPost: async (currentMemberId: string, data: PostCreateReqDTO) => {
    const response = await instance.post("/posts", data, {
      params: { currentMemberId }, //
    });
    return response.data;
  },
};
