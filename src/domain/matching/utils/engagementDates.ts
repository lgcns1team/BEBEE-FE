import { addDays } from "date-fns";
import type { Engagement } from "../../../types/match.type";

const DAY_OF_WEEK_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const getEngagementDateSet = (
  engagements: (Engagement | undefined | null)[]
) => {
  const result = new Set<string>();

  engagements.forEach((eng) => {
    if (!eng || !eng.type || !eng.engagementTime) return;

    /** DAY */
    if (eng.type === "DAY") {
      const date = (eng.engagementTime as any)?.date;
      if (date) {
        result.add(date);
      }
      return;
    }

    /** TERM */
    if (eng.type === "TERM") {
      const { startDate, endDate, schedules } = eng.engagementTime as any;

      if (!startDate || !endDate || !Array.isArray(schedules)) return;

      let cur = new Date(startDate);
      const end = new Date(endDate);

      while (cur <= end) {
        const day = cur.getDay();

        const hasSchedule = schedules.some(
          (s: any) => s?.dayOfWeek && DAY_OF_WEEK_MAP[s.dayOfWeek] === day
        );

        if (hasSchedule) {
          result.add(cur.toISOString().slice(0, 10));
        }

        cur = addDays(cur, 1);
      }
    }
  });

  return result;
};
