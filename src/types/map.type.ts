import type { DayOfWeek } from "./common.types";
import type { Gender } from "./common.types";

export type MapFindType = "CURRENT" | "HOME";

export interface NearByPostReqDto {
  type: MapFindType;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface NearByPostDto {
  postId: string;
  title: string;
  legalDongName: string;
  helpCategories: number[];
  date: string | null;
  dayOfWeeks: DayOfWeek[];
  latitude: number;
  longitude: number;
}

export interface NearByPostResDto {
  nearByPosts: NearByPostDto[];
}

export interface NearByHelperReqDto {
  type: MapFindType;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface NearByHelperDto {
  id: string;
  nickname: string;
  gender: Gender;
  ageGroup: number;
  latitude: number;
  longitude: number;
  helpCategories: number[];
}
export interface NearByHelperResDto {
  nearByHelpers: NearByHelperDto[];
}
