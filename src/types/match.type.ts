import type { DayOfWeek } from "./common.types";

export type EngagementType = "DAY" | "TERM" | null;

export type Status =
  | "INACTIVE"
  | "ACTIVE"
  | "COMPLETED"
  | "REVIEW_ACTIVE"
  | "REVIEW_COMPLETED";

export interface Engagement {
  engagementId: string;
  matchId: string;
  agreementId: string;

  otherId: string;
  otherNickname: string;

  thumbnailImageUrl: string;
  title: string;

  chatRoomId: string;
  region: string;

  helpType: EngagementType; // "DAY" | "TERM"
  date: string | null;
  dayOfWeeks: DayOfWeek[]; // TERM 요일들

  status: Status;
  helpCategoryIds: number[];
  unitHoney?: number;
  totalHoney?: number;
  myRole?: "DISABLED" | "HELPER";
}

// 활동 완료 응답
export interface GetEngagementCompleteResponse {
  isLastEngagement: boolean;
}

// 캘린더 마킹용
export interface EngagementCalendarResponse {
  activeDates: string[];
}

// 매칭 확인서 상세
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

  region?: string;
}
