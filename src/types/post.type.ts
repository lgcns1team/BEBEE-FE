export type HelpType = "DAY" | "TERM";
export type Gender = "MALE" | "FEMALE";
/**
 * 요일
 */
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

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

/** 5. UI <-> 서버 매핑 상수 */
export const SERVER_MAPPING = {
  DAYS: {
    월: "MONDAY",
    화: "TUESDAY",
    수: "WEDNESDAY",
    목: "THURSDAY",
    금: "FRIDAY",
    토: "SATURDAY",
    일: "SUNDAY",
  },
  GENDER: {
    남자: "MALE",
    여자: "FEMALE",
  },
} as const;

export const DAY_OF_WEEK_MAP: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

/*게시글 작성 타입*/
export interface Schedule {
  dayOfWeek: DayOfWeek;
  startTime: string; // "11:00:00"
  endTime: string; // "14:00:00"
}

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
  memberNickname: string;
  memberLegalDongCode: string;
  memberProfileImageUrl: string;

  // 게시글 기본 정보
  title: string;
  content: string;
  engagementType: HelpType; // "DAY" | "TERM"
  unitHoney: number;
  totalHoney: number;
  postLegalDongCode: string;

  // 도움 카테고리
  helpCategoryIds: number[];

  // 날짜/시간 정보
  date?: string; // DAY 타입일 때 존재
  startDate?: string; // TERM 타입일 때 존재
  endDate?: string; // TERM 타입일 때 존재
  schedules: Schedule[];

  // 게시글 이미지 및 기타
  postImages: string[]; // 명세에 포함된 이미지 목록
  applicantCount: number; // 명세에 포함된 신청자 수
}
