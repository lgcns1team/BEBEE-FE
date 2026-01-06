/**
 * 공통 타입 및 유틸리티
 * 여러 파일에서 중복 사용되던 타입과 함수들을 통합
 */
import { eachDayOfInterval, format } from "date-fns";

// ==================== 타입 정의 ====================

/**
 * 도움 유형
 */
export type HelpType = "DAY" | "TERM";

/**
 * 요일 타입
 */
export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

/**
 * 성별 타입
 */
export type Gender = "MALE" | "FEMALE";

/**
 * 스케줄 인터페이스 (공통)
 */
export interface Schedule {
  dayOfWeek: DayOfWeek;
  startTime: string; // "11:00:00" 형식
  endTime: string; // "14:00:00" 형식
}

// ==================== 상수 정의 ====================

/**
 * 영문 요일 → 한글 요일 매핑
 */
export const DAY_OF_WEEK_MAP: Record<DayOfWeek, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

/**
 * 영문 요일 → 한글 요일명 매핑 (요일 포함)
 */
export const DAY_OF_WEEK_FULL_MAP: Record<DayOfWeek, string> = {
  MONDAY: "월요일",
  TUESDAY: "화요일",
  WEDNESDAY: "수요일",
  THURSDAY: "목요일",
  FRIDAY: "금요일",
  SATURDAY: "토요일",
  SUNDAY: "일요일",
};

/**
 * 한글 요일 → 영문 요일 매핑 (서버 통신용)
 */
export const DAY_NAME_TO_DAY_OF_WEEK: Record<string, DayOfWeek> = {
  월: "MONDAY",
  화: "TUESDAY",
  수: "WEDNESDAY",
  목: "THURSDAY",
  금: "FRIDAY",
  토: "SATURDAY",
  일: "SUNDAY",
};

/**
 * 서버 매핑 상수 (기존 호환성 유지)
 */
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

/**
 * Date.getDay() 반환값 → DayOfWeek 매핑
 */
export const DATE_DAY_TO_DAY_OF_WEEK: Record<number, DayOfWeek> = {
  0: "SUNDAY",
  1: "MONDAY",
  2: "TUESDAY",
  3: "WEDNESDAY",
  4: "THURSDAY",
  5: "FRIDAY",
  6: "SATURDAY",
};

// ==================== 유틸리티 함수 ====================

/**
 * 한글 요일명을 DayOfWeek로 변환
 * @param dayName 한글 요일명 (예: "월", "화요일")
 * @returns DayOfWeek 타입의 요일
 */
export const convertDayNameToDayOfWeek = (dayName: string): DayOfWeek => {
  // "요일" 제거 (예: "월요일" → "월")
  const normalized = dayName.replace("요일", "").trim();
  return DAY_NAME_TO_DAY_OF_WEEK[normalized] || "MONDAY";
};

/**
 * Date 객체에서 DayOfWeek 추출
 * @param date Date 객체
 * @returns DayOfWeek 타입의 요일
 */
export const getDayOfWeekFromDate = (date: Date): DayOfWeek => {
  const dayIndex = date.getDay();
  return DATE_DAY_TO_DAY_OF_WEEK[dayIndex] || "MONDAY";
};

/**
 * DayOfWeek를 한글 요일로 변환
 * @param dayOfWeek DayOfWeek 타입
 * @param includeSuffix "요일" 접미사 포함 여부 (기본값: false)
 * @returns 한글 요일 (예: "월" 또는 "월요일")
 */
export const formatDayOfWeek = (
  dayOfWeek?: string,
  includeSuffix: boolean = false
): string => {
  if (!dayOfWeek) return "";
  const map = includeSuffix ? DAY_OF_WEEK_FULL_MAP : DAY_OF_WEEK_MAP;
  return map[dayOfWeek as DayOfWeek] || dayOfWeek;
};

/**
 * Date 객체를 YYYY-MM-DD 형식 문자열로 변환
 * @param date Date 객체 또는 null
 * @returns "YYYY-MM-DD" 형식 문자열
 */
export const formatDateToISO = (date: Date | null): string => {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Date 객체를 HH:mm:ss 형식 문자열로 변환
 * @param date Date 객체 또는 null
 * @returns "HH:mm:ss" 형식 문자열 (null인 경우 "00:00:00")
 */
export const formatTimeToISO = (date: Date | null): string => {
  if (!date) return "00:00:00";
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}:00`;
};

/**
 * 날짜 문자열을 한글 형식으로 포맷팅
 * @param dateStr 날짜 문자열 (ISO 형식)
 * @returns 한글 날짜 형식 (예: "2025년 12월 19일")
 */
export const formatDateToKorean = (dateStr?: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * 날짜 문자열을 한글 형식으로 포맷팅 (요일 포함)
 * @param dateStr 날짜 문자열 (ISO 형식)
 * @returns 한글 날짜 형식 (예: "2025년 11월 21일 (수)")
 */
export const formatDateToKoreanWithDay = (dateStr?: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const dayOfWeek = getDayOfWeekFromDate(date);
  const dayName = DAY_OF_WEEK_MAP[dayOfWeek] || "";
  const koreanDate = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return `${koreanDate} (${dayName})`;
};

/**
 * 시간 문자열을 HH:mm 형식으로 포맷팅
 * @param timeStr 시간 문자열 (예: "11:30:00" 또는 "11:30")
 * @returns "HH:mm" 형식 문자열
 */
export const formatTimeToHHmm = (timeStr?: string): string => {
  if (!timeStr) return "";
  // "HH:mm:ss" 형식이면 앞 5자리만, "HH:mm" 형식이면 그대로
  return timeStr.length >= 5 ? timeStr.substring(0, 5) : timeStr;
};

/**
 * 날짜 문자열을 YYYY.MM.DD 형식으로 포맷팅
 * @param dateStr 날짜 문자열 (ISO 형식)
 * @returns "YYYY.MM.DD" 형식 문자열
 */
export const formatDateToDot = (dateStr: string): string => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}.${String(d.getDate()).padStart(2, "0")}`;
};

/**
 * YYYY-MM-DD → "11월 31일 (화)" 형식으로 포맷팅
 * @param date 날짜 문자열 (ISO 형식)
 * @returns "11월 31일 (화)" 형식 문자열
 */
export const formatDayDate = (date: string): string => {
  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dayLabel = DAY_OF_WEEK_MAP[getDayOfWeekFromDate(d)] || "";
  return `${month}월 ${day}일 (${dayLabel})`;
};

/**
 * 게시글 스케줄 텍스트 생성
 * DAY 타입: "11월 30일 (화)" 형식
 * TERM 타입: "월요일, 수요일, 목요일" 형식
 * @param helpType 도움 유형 ("DAY" | "TERM")
 * @param date 날짜 문자열 (DAY 타입일 때만 사용)
 * @param dayOfWeeks 요일 배열
 * @returns 포맷팅된 스케줄 텍스트
 */
export const getScheduleText = (
  helpType: HelpType,
  date: string | undefined,
  dayOfWeeks: DayOfWeek[]
): string => {
  if (helpType === "DAY" && date) {
    // DAY: "11월 30일 (화)" 형식
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const dayName = DAY_OF_WEEK_MAP[dayOfWeeks[0]] || "";
    return `${month}월 ${day}일 (${dayName})`;
  }
  // TERM: "월요일, 수요일, 목요일" 형식
  return dayOfWeeks.map((d) => `${DAY_OF_WEEK_MAP[d]}요일`).join(", ");
};

/**
 * 시작일~종료일 사이에서 선택된 요일들이 총 몇 번 포함되는지 계산
 * @param startDate 시작일 (YYYY-MM-DD 형식)
 * @param endDate 종료일 (YYYY-MM-DD 형식)
 * @param schedules 스케줄 배열 (dayOfWeek 포함)
 * @returns 총 발생 횟수
 */
/**
 * 시작일~종료일 사이에서 선택된 요일들이 총 몇 번 포함되는지 계산
 * @param startDate 시작일 (YYYY-MM-DD 형식)
 * @param endDate 종료일 (YYYY-MM-DD 형식)
 * @param schedules 스케줄 배열 (dayOfWeek 포함)
 * @returns 총 발생 횟수
 */
export const calculateTotalOccurrences = (
  startDate: string,
  endDate: string,
  schedules: { dayOfWeek: string }[]
): number => {
  if (!startDate || !endDate || !schedules.length) return 0;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const selectedDays = schedules.map((s) => s.dayOfWeek); // ["MONDAY", "WEDNESDAY"]

    // 기간 내의 모든 날짜 배열 생성
    const allDays = eachDayOfInterval({ start, end });

    // 선택한 요일에 해당하는 날짜만 필터링
    const targetDays = allDays.filter((day: Date) => {
      const dayEn = format(day, "EEEE").toUpperCase(); // "MONDAY"
      return selectedDays.includes(dayEn);
    });

    return targetDays.length;
  } catch (error) {
    console.error("calculateTotalOccurrences 오류:", error);
    return 0;
  }
};
