import type { DayOfWeek } from "../../types/common.types";

export type HelpType = "DAY" | "TERM";

// 하루도움 참여 시간
export interface DayEngagementTime {
  date: string; // YYYY-MM-DD
  schedule: {
    dayOfWeek: DayOfWeek;
    startTime: string; // HH:mm:ss
    endTime: string; // HH:mm:ss
  };
}

// 지속도움 참여 시간
export interface TermEngagementTime {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  schedules: Array<{
    dayOfWeek: DayOfWeek;
    startTime: string; // HH:mm:ss
    endTime: string; // HH:mm:ss
  }>;
}

// 매칭 확인서 생성 요청
export interface AgreementRequest {
  postId: string;
  helperId: string;
  disabledId: string;
  memberId?: string;
  type: HelpType;
  isVolunteer: boolean;
  unitHoney: number;
  totalHoney: number;
  region: string;
  helpCategoryIds: number[];
  engagementTime: DayEngagementTime | TermEngagementTime;
  title?: string;
}

// 응답 - help category
export interface HelpCategory {
  helpCategoryId: number;
  categoryName: string;
}

// 매칭 확인서 응답
export interface AgreementResponse {
  agreementId: string;
  status: "BEFORE" | "AFTER" | "CANCEL";
  confirmationDate: string; // YYYY-MM-DD
  type: HelpType;
  isVolunteer: boolean;
  helpCategories: HelpCategory[];
  unitHoney: number;
  totalHoney: number;
  region: string;
  isDayComplete: boolean;
  isTermComplete: boolean;
}

//수락 요청 타입

export interface AgreementMetadata {
  agreementId: string;
  postId: string;
  title: string;
  helperId: string;
  disabledId: string;
  chatroomId: string;
}
