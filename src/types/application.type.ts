export type Gender = "MALE" | "FEMALE";

// 게시글 목록 조회
export interface ApplicationPostDayEngagementTime {
  date: string;
  schedule: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  };
}

export interface ApplicationPostTermEngagementTime {
  startDate: string;
  endDate: string;
  schedules: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
}

export interface ApplicationPost {
  postId: string;
  title: string;
  region: string;
  commonApplicantCount: number;
  volunteerApplicantCount: number;
  isMatched: boolean;
  daysRemaining: number;
  engagementTime:
    | ApplicationPostDayEngagementTime
    | ApplicationPostTermEngagementTime;
  helpCategories: number[];
}

export interface GetApplicationPostsResponse {
  posts: ApplicationPost[];
}

// 도우미 지원
export interface ApplyHelperRequest {
  // memberId: string;
  postId: string;
  isVolunteer: boolean;
}

// 지원자 목록 조회
export interface Applicant {
  memberId: string;
  postId: string;
  nickname: string;
  ageGroup: number;
  gender: Gender;
  isVolunteer: boolean;
}

export interface GetApplicantsResponse {
  applicants: Applicant[];
}
