export type HelpCategory = "하루 도움" | "지속 도움";
export type MatchingStatus = "COMPLETED" | "DISCOMPLETED";
interface BaseMatchingHelp {
  postId: number;
  agreementId: number;
  type: HelpCategory;
  totalHoney: number;
  region: string;
  engagementStatus: MatchingStatus;
}

interface Schedule {
  dayOfWeek: "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";
  startTime: string;
  endTime: string;
}

export interface DayMatchingHelp extends BaseMatchingHelp {
  type: "하루 도움";
  engagementDate: Date;
  time: { startTime: Date; endTime: Date };
}

export interface LongMatchingHelp extends BaseMatchingHelp {
  type: "지속 도움";
  startDate: Date;
  endDate: Date;
  dayOfWeek?: Schedule[];
}

export type MatchingHelp = DayMatchingHelp | LongMatchingHelp;

export interface Agreement {
  agreementId: number;
  postId: number;
  helperId: number;
  disabledId: number;
  help: MatchingHelp;
}
