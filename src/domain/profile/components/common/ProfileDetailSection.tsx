import { useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import { useOtherMemberStore } from "../../store/useOtherMemberStore";
import BadgeChips from "../../../Badge/components/BadgeChips";
import { DISABILITY_TYPES } from "../../../../constants/disabilityTypes";

// BadgeChips랑 동일한 코드
type BadgeCode = "LEVEL_1" | "LEVEL_2" | null;

const getBadgeTitle = (label: string, code: BadgeCode) => {
  if (code === "LEVEL_1") return `${label} 조력자`;
  if (code === "LEVEL_2") return `${label} 전문가`;
  return null;
};
const ProfileDetailSection = () => {
  const { profileId } = useParams<{ profileId: string }>();

  const { profile, isLoading, error, fetchMemberProfile, clearProfile } =
    useOtherMemberStore();

  useEffect(() => {
    if (!profileId) return;

    fetchMemberProfile(profileId);

    return () => {
      clearProfile();
    };
  }, [profileId, fetchMemberProfile, clearProfile]);

  const badges = profile.badges ?? [];

const badgeTitles = badges
  .map((b: any) => {
    const disability = DISABILITY_TYPES.find(
      (d) => d.id === b.disabilityCategoryId
    );

    if (!disability) return null;

    const title = getBadgeTitle(disability.name, b.badgeCode);
    if (!title) return null;

    
    
  })
  .filter(Boolean) as string[];

const badgeText = badgeTitles.join(", ");
  const genderText = profile.gender === "MALE" ? "남성" : "여성";
  const helpCategoryText =
    profile.helpCategories?.length > 0
      ? profile.helpCategories.join(", ")
      : "-";
  const introText = profile.introduction?.trim() ? profile.introduction : "-";

  const srSummary = [
    `도우미 프로필 정보입니다.`,
    `닉네임 ${profile.nickname}.`,
    `뱃지 ${badgeText ? badgeText : "없음"}.`,
    `성별 ${genderText}.`,
    `나이 ${profile.ageGroup ?? "-"}대.`,
    `주소 ${profile.address ?? "-"}.`,
    `주요 도움 유형 ${helpCategoryText}.`,
    `한줄 소개 ${introText}.`,
  ].join(" ");
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
    <Info aria-label={srSummary} tabIndex={0} role="button">
      <div aria-hidden="true">
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
      </div>
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
