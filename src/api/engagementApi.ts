// src/apis/engagementApi.ts
import { instance } from "./axiosInstance";
import type { Engagement } from "../types/match.type";
import type { EngagementType } from "../types/match.type";
export interface GetEngagementsResponse {
  matches: Engagement[];
}

export const getEngagements = (params: {
  memberId: string;
  date: string;
  engagementType?: EngagementType;
}) => {
  return instance.get<GetEngagementsResponse>("/engagements", {
    params,
  });
};
