import type { PostItem } from "./post.type";
export type Role = "DISABLED" | "HELPER";

export interface DisabledProfile {
  memberId: number;
  name?: string;
  nickname?: string;
  profileImageUrl?: string;
  gender?: string;
  age?: string;
  addressRoad?: string;
  helpType?: string[];
  introduction?: string;
  disabilityType?: string;
  description?: string;
  helpRequestPost?: PostItem[];
  receivedReviews?: string[];
}

export interface HelperProfile {
  memberId: number;
  name: string;
  nickname?: string;
  profileImageUrl?: string;
  gender?: string;
  age?: string;
  addressRoad?: string;
  helpType?: string[];
  introduction?: string;
  receivedReviews?: string[];
}
