import { instance } from "./axiosInstance";
import type {
  GetPostsRequest,
  GetPostsResponse,
  PostCreateReqDTO,
} from "../types/post.type";

export const postApi = {
  /**
   * 게시글 목록 조회 (필터 및 무한 스크롤 포함)
   */
  getPosts: async (params: GetPostsRequest): Promise<GetPostsResponse> => {
    const { data } = await instance.get<GetPostsResponse>("/posts", {
      params, // GetPostsRequest에 정의된 모든 필드가 쿼리 스트링으로 변환됨
    });
    return data;
  },
  createPost: async (currentMemberId: string, data: PostCreateReqDTO) => {
    const response = await instance.post(`/posts`, data, {
      params: { currentMemberId }, //
    });
    return response.data;
  },
};
