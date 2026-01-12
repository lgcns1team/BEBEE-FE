import type { DayOfWeek } from "../../../types/common.types";

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
  type: HelpType;
  isVolunteer: boolean;
  unitHoney: number;
  totalHoney: number;
  region: string;
  helpCategoryIds: number[];
  engagementTime: DayEngagementTime | TermEngagementTime;
  chatroomId: string;
  createdAt: string;
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
  confirmationDate: string;
  type: HelpType;
  isVolunteer: boolean;
  helpCategories: HelpCategory[];
  unitHoney: number;
  totalHoney: number;
  region: string;
  isDayComplete: boolean;
  isTermComplete: boolean;
}

// 매칭 확인서 수락 요청 타입
export interface AgreementConfirmRequest {
  disabledId: string;
  postId: string;
  title: string;
  chatroomId: string;
  chatId: string;
  createdAt: string;
}

// 매칭 확인서 수락 응답 타입
export interface AgreementConfirmResponse {
  matchId: string;
}

// 매칭 확인서 거절 요청 타입
export interface AgreementRefuseRequest {
  disabledId: string;
  chatroomId: string;
  chatId: string;
  createdAt: string;
}

// 매칭 확인서 메타데이터 (localStorage 저장용, agreementId를 키로 사용)
export interface AgreementMetadata {
  agreementId: string;
  postId: string;
  title: string;
  helperId: string;
  disabledId: string;
  chatroomId: string;
}

// 웹소켓으로 수신되는 engagementTime 형식 (DAY/TERM 통합)
export interface EngagementTimeResponse {
  date?: string | null; // YYYY-MM-DD (DAY 타입용)
  startDate?: string | null; // YYYY-MM-DD (TERM 타입용)
  endDate?: string | null; // YYYY-MM-DD (TERM 타입용)
  schedule?: {
    dayOfWeek: DayOfWeek;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  } | null; // DAY 타입용
  schedules?: Array<{
    dayOfWeek: DayOfWeek;
    startTime: string; // HH:mm
    endTime: string; // HH:mm
  }> | null; // TERM 타입용
}

// 웹소켓으로 수신되는 매칭 확인서 데이터 (서버 응답 형식)
export interface MatchDataResponse {
  agreementId: string;
  type: HelpType;
  receiverId: string;
  helperId: string;
  isVolunteer: boolean;
  unitHoney: number;
  totalHoney: number;
  region: string;
  helpCategoryIds: number[];
  status: "PROCEEDING" | "BEFORE" | "AFTER" | "CANCEL";
  engagementTime: EngagementTimeResponse;
}
