import { eachDayOfInterval, format } from "date-fns";
import { getErrorMessage } from "../../../utils/error";
/**
 * 시작일~종료일 사이에서 선택된 요일들이 총 몇 번 포함되는지 계산
 */
export const calculateTotalOccurrences = (
  startDate: string,
  endDate: string,
  schedules: { dayOfWeek: string }[]
) => {
  if (!startDate || !endDate || !schedules.length) return 0;

  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const selectedDays = schedules.map((s) => s.dayOfWeek); // ["MONDAY", "WEDNESDAY"]

    // 기간 내의 모든 날짜 배열 생성
    const allDays = eachDayOfInterval({ start, end });

    // 선택한 요일에 해당하는 날짜만 필터링
    const targetDays = allDays.filter((day) => {
      const dayEn = format(day, "EEEE").toUpperCase(); // "MONDAY"
      return selectedDays.includes(dayEn);
    });

    return targetDays.length;
  } catch (error) {
    getErrorMessage(error, "입력된 꿀이 없습니다");
    return 0;
  }
};
