import type { DayOfWeek } from "./common.types";
export type EngagementType = "DAY" | "TERM";

export interface UserSummary {
  memberId: string;
  nickname: string;
  profileImageUrl?: string;
  gender?: string;
  ageGroup?: number;
}

export interface HelpCategory {
  helpCategoryId: number;
  helpCategoryName: string;
}

/* ---------- DAY ---------- */
export interface DayEngagementTime {
  date: string;
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
}

/* ---------- TERM ---------- */
export interface TermEngagementTime {
  startDate: string;
  endDate: string;
  schedules: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
}

export type EngagementTime = DayEngagementTime | TermEngagementTime;

export type Status =
  | "INACTIVE"
  | "ACTIVE"
  | "COMPLETED"
  | "REVIEW_ACTIVE"
  | "REVIEW_COMPLETED";

export interface Engagement {
  myRole: "DISABLED" | "HELPER";
  engagementId: string;
  matchId: string;
  agreementId: string;
  otherId: string;
  otherNickname: string;
  thumbnailImageUrl: string;
  title: string;
  chatRoomId: string;
  region: string;
  dayOfWeeks: DayOfWeek[];
  date: string;
  status: Status;
  helpCategoryIds: number[];
  type: EngagementType;
  unitHoney: number;
  totalHoney: number;
  engagementTime: EngagementTime;
}

// 활동 완료 체크 응답
export interface getEngagementCompleteResponse {
  status: "COMPLETED" | "REVIEW_ACTIVE";
  isLastEngagement: boolean;
}

export interface EngagementSchedule {
  dayOfWeek: DayOfWeek;
  startTime: string;
  endTime: string;
}

export interface EngagementDetail {
  agreementId: string;
  helpType: EngagementType;

  // DAY
  date: string | null;

  // TERM
  startDate: string | null;
  endDate: string | null;

  schedules: EngagementSchedule[];

  unitHoney: number;
  totalHoney: number;

  otherId: string;
  otherProfileImageUrl: string;
  otherNickname: string;
  otherGender: "MALE" | "FEMALE";
  otherAgeGroup: number;
}
