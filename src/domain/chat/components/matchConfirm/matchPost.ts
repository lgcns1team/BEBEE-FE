export interface MatchPost {
  type: "day" | "long";
  title: string;
  reward: number;
  location: string;

  date?: Date | null;
  startTime?: Date | null;
  endTime?: Date | null;

  periodStart?: Date | null;
  periodEnd?: Date | null;

  weeks?: {
    day: string;
    start: Date | null;
    end: Date | null;
  }[];
}
