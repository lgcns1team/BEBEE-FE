import { instance } from "./axiosInstance";

import type {
  GetApplicationPostsResponse,
  GetApplicantsResponse,
  ApplyHelperRequest,
} from "../types/application.type";

// 장애인 유저가 본인이 작성한 게시글 목록 조회

export const getApplicationPosts = (params: { memberId: string }) => {
  return instance.get<GetApplicationPostsResponse>(
    "/match/helper-applications/posts",
    { params }
  );
};

// 도우미가 지원
export const applyHelper = (body: ApplyHelperRequest) => {
  return instance.post("/match/helper-applications", body);
};
// 특정 게시글의 지원자 목록 조회

export const getApplicantsByPostId = (params: {
  postId: string;
  memberId: string;
}) => {
  const { postId, memberId } = params;

  return instance.get<GetApplicantsResponse>(
    `/match/helper-applications/posts/${postId}/applicants`,
    {
      params: { memberId },
    }
  );
};
