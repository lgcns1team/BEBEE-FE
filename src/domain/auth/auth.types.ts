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
