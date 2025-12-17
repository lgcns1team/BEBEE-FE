// types/post.ts

export type PostType = "DAY" | "TERM";
export type PostStatus = "NON_MATCHED" | "PROCEEDING" | "MATCHED";
export type DayOfWeek = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

// 위치 정보 그룹화
export interface LocationData {
  region: string;
  legaldongCode: string;
  latitude: number;
  longitude: number;
}

// 요일별 스케줄 (HelpRequestPostTimeSchedule 대응)
export interface DailySchedule {
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

// 메인 게시글 데이터 구조
export interface PostRequest {
  // HelpRequestPost
  title: string;
  type: PostType;
  unitHoney: number;
  totalHoney: number;
  location: LocationData;
  content: string;
  isVolunteer: boolean;

  // HelpRequestPostEngagementTimeDay (type === 'DAY' 일 때 필수)
  engagementDate?: string; // YYYY-MM-DD
  engagementTime?: string; // HH:mm

  // HelpRequestPostEngagementTimeTerm (type === 'TERM' 일 때 필수)
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD

  // HelpRequestPostTimeSchedule (type === 'TERM' 일 때 사용)
  schedules?: DailySchedule[];

  // PostImage (업로드를 위한 파일 객체 혹은 URL)
  images: Array<{ file?: File; url: string; sequence: number }>;
}
