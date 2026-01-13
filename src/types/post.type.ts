// 공통 타입은 common.types.ts에서 import
import type { HelpType, Gender, DayOfWeek, Schedule } from "./common.types";
export type { HelpType, Gender, DayOfWeek, Schedule };

/** 1. 서버 응답 데이터 타입 (PostCard에서 사용) */
export interface PostItem {
  postId: string;
  title: string;
  isMatched: boolean;
  unitHoney: number;
  totalHoney: number;
  legalDongName: string;
  helpCategories: number[];
  helpType: HelpType;
  imageUrl: string;
  date: string;
  dayOfWeeks: DayOfWeek[];
}

/** 2. 서버 응답 전체 구조 */
export interface GetPostsResponse {
  hasNext: boolean;
  nextPostId: string | null;
  posts: PostItem[];
}

/** 3. reqDTO (필터 조건) 구조 */
export interface PostsGetReqDTO {
  legalDongCodes?: string[];
  helpCategories?: number[];
  gender?: Gender;
  minHoney?: number;
  maxHoney?: number;
  disabilityCategoryIds?: number[];
  days?: DayOfWeek[];
}

/** 4. 최종 API 요청 파라미터  */
export interface GetPostsRequest {
  currentMemberId: string;
  type?: HelpType | null; // DAY | TERM (전체일 땐 생략)
  isMatched?: boolean | null; // 매칭 여부
  lastPostId?: string | null; // 커서
  count?: number | null; // 페이지 당 개수
  reqDTO: PostsGetReqDTO;
}

import { SERVER_MAPPING, DAY_OF_WEEK_MAP } from "./common.types";
export { SERVER_MAPPING, DAY_OF_WEEK_MAP };

export interface PostCreateReqDTO {
  postType: "DAY" | "TERM";
  postImages: string[];
  title: string;
  helpCategoryIds: number[];
  content: string;
  startDate?: string; // TERM용
  endDate?: string; // TERM용
  schedules: Schedule[];
  date?: string; // DAY용
  unitHoney: number;
  totalHoney: number;
  region: string;
  latitude: number;
  longitude: number;
}

/** 게시글 상세 정보 응답 타입 */
export interface PostDetailResponse {
  // 회원 정보
  memberId: string;
  memberNickname: string;
  memberLegalDongCode: string;
  memberProfileImageUrl: string;

  // 게시글 기본 정보
  title: string;
  content: string;
  engagementType: HelpType; // "DAY" | "TERM"
  unitHoney: number;
  totalHoney: number;
  postAddress: string;

  // 도움 카테고리
  helpCategoryIds: number[];

  // 날짜/시간 정보
  date?: string; // DAY 타입일 때 존재
  startDate?: string; // TERM 타입일 때 존재
  endDate?: string; // TERM 타입일 때 존재
  schedules: Schedule[];

  // 게시글 이미지 및 기타
  postImageUrls: string[]; 
  applicantCount: number; 
}
