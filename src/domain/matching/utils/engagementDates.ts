import { addDays } from "date-fns";

const DAY_OF_WEEK_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const getEngagementDateSet = (engagements: any[]) => {
  const result = new Set<string>();

  engagements.forEach((eng) => {
    /** DAY */
    if (eng.type === "DAY") {
      result.add(eng.engagementTime.date);
      return;
    }

    /** TERM */
    if (eng.type === "TERM") {
      const { startDate, endDate, schedules } = eng.engagementTime;

      let cur = new Date(startDate);
      const end = new Date(endDate);

      while (cur <= end) {
        const day = cur.getDay();

        const hasSchedule = schedules.some(
          (s: any) => DAY_OF_WEEK_MAP[s.dayOfWeek] === day
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
