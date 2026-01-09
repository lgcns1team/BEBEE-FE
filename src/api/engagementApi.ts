// src/apis/engagementApi.ts
import { instance } from "./axiosInstance";
import type { Engagement } from "../types/match.type";
import type { EngagementType } from "../types/match.type";
import type { getEngagementCompleteResponse } from "../types/match.type";
export interface GetEngagementsResponse {
  matches: Engagement[];
}

export const getEngagements = (params: {
  date: string;
  engagementType?: EngagementType;
}) => {
  return instance.get<GetEngagementsResponse>("/match/engagements", {
    params,
  });
};

export const getEngagementCompleteStatus = (params: {
  agreementId: string;
}) => {
  return instance.post<getEngagementCompleteResponse>(
    `/match/engagements/${params.agreementId}/complete`,
    null,
    {
      params: {
        currentMemberId: "100",
      },
    }
  );
};
