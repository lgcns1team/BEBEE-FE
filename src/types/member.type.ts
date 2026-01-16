import type { Gender } from "./common.types";

export type MyRole = "DISABLED" | "HELPER" | "ADMIN";

export type BadgeCode = "LEVEL_1" | "LEVEL_2" | null;

// export interface ReviewCount {
//   keywordId: number;
//   count: number;
// }
export interface ReviewCount {
  keywordId: number;
  description: string;
  isPositive: boolean;
  count: number;
}

export interface Badge {
  disabilityCategoryId: number;
  count: number;
  badgeCode: BadgeCode
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
  reviews: ReviewCount[];

  // documents: any[] | null;
  badges: Badge[] | null;

  disabilityType: string | null;
  disabilityDescription: string | null;
}

// 타인이 보는 프로필 조회

export interface MemberProfile {
  nickname: string;
  email: string;
  role: "DISABLED" | "HELPER" | "ADMIN";

  profileImageUrl: string | null;

  gender: Gender;
  ageGroup: number;

  address: string;

  helpCategories: number[];

  introduction: string;

  honey: number;

  reviews: ReviewCount[];
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
  honey: number;
  address: string;
  gender: string;
  birthDate: string; // date 형식
  ageGroup: number;
  helpTypes: string[];
  documents: object[];
  disabilityType: string;
  disabilityDescription: string;
  badges: Badge[] | null;
  reviews: ReviewCount[];
   helpCategories: number[];

}
