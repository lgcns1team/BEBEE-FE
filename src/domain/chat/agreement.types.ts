export type HelpType = "DAY" | "TERM";
// 매칭 확인서 생성 요청
export interface AgreementRequest {
  memberId: number;
  type: HelpType;
  isVolunteer: boolean;
  unitHoney: number;
  totalHoney: number;
  region: string;
  helpCategoryIds: number[];
  title?: string;
  weeks?: any[];
}

// 응답 - help category
export interface HelpCategory {
  helpCategoryId: number;
  categoryName: string;
}

// 매칭 확인서 응답
export interface AgreementResponse {
  agreementId: number;
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
