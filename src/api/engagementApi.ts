// src/apis/engagementApi.ts
import { instance } from "./axiosInstance";
import type { Engagement } from "../types/match.type";
import type { EngagementType } from "../types/match.type";
import type { getEngagementCompleteResponse } from "../types/match.type";
export interface GetEngagementsResponse {
  matches: Engagement[];
}

export const getEngagements = (params: {
  memberId: "100";
  date: string;
  engagementType?: EngagementType;
}) => {
  return instance.get<GetEngagementsResponse>("/match/engagements", {
    params,
  });
};

export const getEngagementCompleteStatus = (params: {
  currentMemberId: "100";
  engagementId: string;
}) => {
  return instance.post<getEngagementCompleteResponse>(
    `/match/engagements/${params.engagementId}/complete`,
    null,
    {
      params: {
        currentMemberId: "100",
      },
    }
  );
};
