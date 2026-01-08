import { instance } from "./axiosInstance";
import type {
  GetPostsRequest,
  GetPostsResponse,
  PostCreateReqDTO,
  PostDetailResponse,
} from "../types/post.type";

export const postApi = {
  /**
   * 게시글 목록 조회 API
   */
  getPosts: async (params: GetPostsRequest): Promise<GetPostsResponse> => {
    const { type, isMatched, lastPostId, count = 20, reqDTO } = params;

    // 쿼리 파라미터 구성
    const queryParams: Record<string, string | number | boolean> = {
      count,
    };

    // type이 있을 경우만 추가 (전체면 보내지 않음)
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

    // reqDTO 필드들을 쿼리 파라미터로 변환
    if (reqDTO) {
      // legalDongCodes: 배열을 콤마로 구분된 문자열로 변환
      if (reqDTO.legalDongCodes && reqDTO.legalDongCodes.length > 0) {
        queryParams.legalDongCodes = reqDTO.legalDongCodes.join(",");
      }

      // helpCategories: 배열을 콤마로 구분된 문자열로 변환
      if (reqDTO.helpCategories && reqDTO.helpCategories.length > 0) {
        queryParams.helpCategories = reqDTO.helpCategories.join(",");
      }

      // gender: 그대로 전달
      if (reqDTO.gender) {
        queryParams.gender = reqDTO.gender;
      }

      // minHoney: 그대로 전달
      if (reqDTO.minHoney !== undefined) {
        queryParams.minHoney = reqDTO.minHoney;
      }

      // maxHoney: 그대로 전달
      if (reqDTO.maxHoney !== undefined) {
        queryParams.maxHoney = reqDTO.maxHoney;
      }

      // disabilityCategoryIds: 배열이면 콤마로 구분된 문자열로 변환, 단일 값이면 그대로
      if (reqDTO.disabilityCategoryIds) {
        if (Array.isArray(reqDTO.disabilityCategoryIds)) {
          if (reqDTO.disabilityCategoryIds.length > 0) {
            queryParams.disabilityCategoryIds =
              reqDTO.disabilityCategoryIds.join(",");
          }
        } else {
          queryParams.disabilityCategoryIds = reqDTO.disabilityCategoryIds;
        }
      }

      // days: 배열을 콤마로 구분된 문자열로 변환
      if (reqDTO.days && reqDTO.days.length > 0) {
        queryParams.days = reqDTO.days.join(",");
      }
    }

    const response = await instance.get<GetPostsResponse>("match/posts", {
      params: queryParams,
    });

    return response.data;
  },

  createPost: async (data: PostCreateReqDTO) => {
    const response = await instance.post("match/posts", data);
    return response.data;
  },

  getPostDetail: async (
    postId: string | number
  ): Promise<PostDetailResponse> => {
    // postId를 문자열로 변환하여 URL에 사용
    const postIdStr = String(postId);
    console.log("게시글 데이터 요청:", {
      postId,
      postIdStr,
      url: `match/posts/${postIdStr}`,
    });

    const response = await instance.get(`match/posts/${postIdStr}`);
    console.log("게시글 데이터 응답:", response.data);

    return response.data;
  },
};
