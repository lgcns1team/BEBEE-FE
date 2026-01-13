export const UserRole = {
  ADMIN: 'ADMIN',
  DISABLED: 'DISABLED',
  HELPER: 'HELPER',
} as const;
export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const Gender = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  NONE: 'NONE',
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  nickname: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  phoneNumber: string;
  role: UserRole;
  addressRoad: string;
  latitude: number;
  longitude: number;
  districtCode: string;

  // HELPER용: 도움 유형 목록
  helpTypes?: string[];

  // DISABLED용: 장애 유형, 등급 및 설명
  disabilityType?: string;
  disabilityGrade?: string;         // "1" = 중증, "2" = 경증
  disabilityDescription?: string;

  // 문서 관련 (Step 5에서 업로드 및 분석 완료)
  fileUrl?: string;
  systemFlag?: string;
}

export interface OcrResult {
  extractedText: string;
  confidence: number;
  keywords: string[];
  names: string[];
  fields?: Record<string, string>;
}

export interface LoginRequest {
  email: string;
  password: string;
}
