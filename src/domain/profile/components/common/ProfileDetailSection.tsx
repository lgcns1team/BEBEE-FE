import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { useOtherMemberStore } from "../../store/useOtherMemberStore";
import BadgeChips from "../../../Badge/components/BadgeChips";

const ProfileDetailSection = () => {
  const { profileId } = useParams<{ profileId: string }>();

  const {
    profile,
    isLoading,
    error,
    fetchMemberProfile,
    clearProfile,
  } = useOtherMemberStore();

 
  useEffect(() => {
    if (!profileId) return;

    fetchMemberProfile(profileId);

    return () => {
      clearProfile();
    };
  }, [profileId, fetchMemberProfile, clearProfile]);

  
  if (isLoading) {
    return <Info>로딩 중...</Info>;
  }

  if (error || !profile) {
    return <Info>프로필 정보를 불러올 수 없습니다.</Info>;
  }

  const infoList = [
    { label: "성별", value: profile.gender === "MALE" ? "남성" : "여성" },
    { label: "나이", value: `${profile.ageGroup}대` },
    { label: "주소", value: profile.address },
    {
      label: "주요 도움",
      value:
        profile.helpCategories.length > 0
          ? profile.helpCategories.join(", ")
          : "-",
    },
    { label: "한줄소개", value: profile.introduction },
  ];

  return (
    <Info>
      <Top>
        <ProfileImageWrapper>
            <ProfileImage src={profile.profileImageUrl ?? ""} alt="프로필" />
          </ProfileImageWrapper>

          <TopRight>
            <NickName>{profile.nickname}</NickName>
            {profile.role === "HELPER" &&
              profile.badges &&
              profile.badges.length > 0 && (
                <BadgeWrapper>
                  <BadgeChips badges={profile.badges} />
                </BadgeWrapper>
              )}
          </TopRight>
      </Top>

      <Bottom>
        {infoList.map(({ label, value }) => (
          <InfoRow key={label}>
            <InfoLabel>{label}</InfoLabel>
            <InfoValue>{value ?? "-"}</InfoValue>
          </InfoRow>
        ))}
      </Bottom>
    </Info>
  );
};

export default ProfileDetailSection;

const Info = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Top = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ProfileImageWrapper = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.color.natural100};
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;


const TopRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NickName = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
`;

const BadgeWrapper = styled.div`
  margin-top: 4px;
`;
const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 12px;
`;

const InfoLabel = styled.div`
  width: 80px;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.4;
  word-break: break-word;
`;


