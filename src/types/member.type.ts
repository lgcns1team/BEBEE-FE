import type { Gender } from "./common.types";

export type MyRole = "DISABLED" | "HELPER" | "ADMIN";

export interface Badge {
  disabilityCategoryId: number;
  count: number;
  badgeCode: string | null;
}
// 내 프로필 조회
export interface MyProfile {
  nickname: string;
  email: string;
  role: MyRole;
  profileImageUrl: string | null;

  gender: Gender;
  ageGroup: number;

  address: string;

  helpCategories: number[];

  introduction: string;

  honey: number;
  // reviews: Review[];

  // documents: any[] | null;
  badges: Badge[] | null;

  disabilityType: string | null;
  disabilityDescription: string | null;
}

// 타인이 보는 프로필 조회

export interface MemberProfile {
  nickname: string;
  email: string;
  role: MyRole;

  profileImageUrl: string | null;

  gender: Gender;
  ageGroup: number;

  address: string;

  helpCategories: number[];

  introduction: string;

  honey: number;

  // reviews: any[];
  // documents: any[] | null;

  badges: Badge[] | null;

  disabilityType: string | null;
  disabilityDescription: string | null;
}

// /member/members/profile/me 응답 타입
export interface Member {
  memberId: string;
  email: string;
  name: string;
  nickname: string;
  role: string;
  phoneNumber: string;
  introduction: string;
  latitude: number;
  longitude: number;
  profileImageUrl: string;
  sweetness: number;
  honeyPoint: number;
  addressRoad: string;
  gender: string;
  birthDate: string; // date 형식
  ageGroup: number;
  helpTypes: string[];
  documents: object[];
  disabilityType: string;
  disabilityDescription: string;
  badges: Badge[] | null;
}
