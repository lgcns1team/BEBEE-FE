import { instance } from "./axiosInstance";
import type {
  Engagement,
  EngagementType,
  EngagementDetail,
  EngagementCalendarResponse,
  GetEngagementCompleteResponse,
} from "../types/match.type";

export interface GetEngagementsResponse {
  engagements: Engagement[];
}

// 활동 관리
export const getEngagements = (params: {
  date: string;
  type?: EngagementType;
}) => {
  return instance.get<GetEngagementsResponse>("/match/engagements", { params });
};

// 활동 관리 캘린더
export const getEngagementsCalendar = (params: {
  year: number;
  month: number;
}) => {
  return instance.get<EngagementCalendarResponse>(
    "/match/engagements/calendar",
    {
      params,
    }
  );
};

// 활동 완료
export const completeEngagement = (engagementId: string) => {
  return instance.patch<GetEngagementCompleteResponse>(
    `/match/engagements/${engagementId}/complete`
  );
};

// 매칭 확인서 노출
export const getAgreementDetail = (agreementId: string) => {
  return instance.get<EngagementDetail>(`/match/agreements/${agreementId}`);
};
