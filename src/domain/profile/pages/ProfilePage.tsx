import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import DisabledProfilePage from "./DisabledProfilePage";
import HelperProfilePage from "./HelperProfilePage";

import { useOtherMemberStore } from "../store/useOtherMemberStore";

const PROFILE_PAGE_BY_ROLE = {
  DISABLED: DisabledProfilePage,
  HELPER: HelperProfilePage,
} as const;

const ProfilePage = () => {
  const { memberId } = useParams<{ memberId: string }>();
  const {
    profile,
    isLoading,
    error,
    fetchMemberProfile,
    clearProfile,
  } = useOtherMemberStore();

  useEffect(() => {
    if (!memberId) return;
    fetchMemberProfile(memberId);

    return () => {
      clearProfile(); // ✅ 여기서만 clear
    };
  }, [memberId, fetchMemberProfile, clearProfile]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error || !profile) return <div>프로필 정보를 불러올 수 없습니다.</div>;

  const RoleProfilePage = PROFILE_PAGE_BY_ROLE[profile.role];
  if (!RoleProfilePage) return <div>지원하지 않는 역할입니다.</div>;

  return <RoleProfilePage />;
};
export default ProfilePage;