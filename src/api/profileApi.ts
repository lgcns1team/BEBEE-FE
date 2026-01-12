import { instance } from "./axiosInstance";
import type { MyProfile } from "../types/profile.type";
import type { MemberProfile } from "../types/profile.type";


// 자신의 프로필 조회
export const getMyProfile = () =>{
    return instance.get<MyProfile>("/member/members/profile/me")
}

// 타인의 프로필 조회
export const getMemberProfile = (memberId: number | string) => {
  return instance.get<MemberProfile>(
    `/member/members/profile/${memberId}`
  );
};