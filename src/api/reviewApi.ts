import { instance } from "./axiosInstance";

export interface ReviewWriteRequest {
  revieweeId: string;
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

export const reviewWrite = (body: ReviewWriteRequest) => {
  return instance.post("/match/reviews", body);
};

export const getReviewKeywords = async () => {
  const response = await instance.get<ReviewKeywordListResponse>(
    "/match/reviews/keywords"
  );
  return response.data;
};
