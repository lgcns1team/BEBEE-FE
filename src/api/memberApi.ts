import { instance } from "./axiosInstance";
import type { MyProfile } from "../types/member.type";
import type { MemberProfile } from "../types/member.type";
import type { Member } from "../types/member.type";

// 자신의 프로필 조회
export const getMyProfile = () => {
  return instance.get<MyProfile>("/member/members/profile/me");
};

// 자신의 멤버 정보 조회 -> 민선님이 만든 위의 api혹시 몰라 안 지웠습니다
export const getMyMemberProfile = () => {
  return instance.get<Member>("/member/members/profile/me");
};

// 타인의 프로필 조회
export const getMemberProfile = (memberId: number | string) => {
  return instance.get<MemberProfile>(`/member/members/profile/${memberId}`);
};
