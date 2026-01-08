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

export interface Engagement {
  myRole: "DISABLED" | "HELPER";
  agreementId: string;
  postId: string;
  title: string;
  thumbnailImageUrl?: string;

  helper: UserSummary;
  disabled: UserSummary;

  confirmationDate: string;
  type: EngagementType;

  helpCategories: HelpCategory[];

  isVolunteer: boolean;
  unitHoney: number;
  totalHoney: number;
  region: string;

  engagementTime: EngagementTime;

  isDayComplete: boolean;
  isTermComplete: boolean;

  chatRoomId: string;
}
