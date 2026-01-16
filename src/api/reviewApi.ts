// import { instance } from "./axiosInstance";

// export interface ReviewWriteRequest {
//   keywordIds: number[];
// }

// export interface ReviewKeyword {
//   keywordId: number;
//   description: string;
//   isPositive: boolean;
// }

// export interface ReviewKeywordListResponse {
//   keywords: ReviewKeyword[];
// }

// export const reviewWrite = (
//   matchId: string,
//   body: ReviewWriteRequest
// ) => {
//   return instance.post(`/match/reviews/${matchId}`, body);
// };
// export const getReviewKeywords = async () => {
//   const response = await instance.get<ReviewKeywordListResponse>(
//     "/match/reviews/keywords"
//   );
//   return response.data;
// };

import { instance } from "./axiosInstance";

export interface ReviewWriteRequest {
  keywordIds: number[];
}

export interface ReviewKeyword {
  keywordId: number;
  description: string;
  isPositive: boolean;
}

export interface ReviewKeywordListResponse {
  keywords: ReviewKeyword[];
}

// ✅ Swagger: POST /reviews/{matchId}
export const reviewWrite = (matchId: string, body: ReviewWriteRequest) => {
  return instance.post(`/match/reviews/${matchId}`, body);
};

// ✅ Swagger: GET /reviews/keywords
export const getReviewKeywords = async () => {
  const response = await instance.get<ReviewKeywordListResponse>(
    "/match/reviews/keywords"
  );
  return response.data; // { keywords: [...] }
};