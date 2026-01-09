// src/apis/engagementApi.ts
import { instance } from "./axiosInstance";
import type { Engagement } from "../types/match.type";
import type { EngagementType } from "../types/match.type";
import type { getEngagementCompleteResponse } from "../types/match.type";
import type { EngagementDetail } from "../types/match.type";

export interface GetEngagementsResponse {
  matches: Engagement[];
}

export const getEngagements = (params: {
  date: string;
  type?: EngagementType;
}) => {
  return instance.get<GetEngagementsResponse>("/match/engagements", {
    params,
  });
};

export const getEngagementCompleteStatus = (params: {
  engagementId: string;
}) => {
  return instance.post<getEngagementCompleteResponse>(
    `/match/engagements/${params.engagementId}/complete`
  );
};

export const getEngagementDetail = (agreementId: string) => {
  return instance.get<EngagementDetail>(`/match/agreements/${agreementId}`);
};
