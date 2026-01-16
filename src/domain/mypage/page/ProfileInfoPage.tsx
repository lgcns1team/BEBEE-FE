import { useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useMemberStore } from "../../../store/useMemberStore";
import ReceivedReview from "../../profile/components/common/ReceivedReview";
import BadgeChips from "../../Badge/components/BadgeChips";
import defaultProfileImage from "../../../assets/images/bee-santa.png";

const ProfileInfoPage = () => {
  const navigate = useNavigate();
  const { member, isLoading, fetchMember } = useMemberStore();

  useEffect(() => {
    if (!member) fetchMember();
  }, [member, fetchMember]);

  if (isLoading && !member) {
    return (
      <Layout bg>
        <Header title="프로필" showBack onBack={() => navigate(-1)} bg />
        <div style={{ padding: 40, textAlign: "center" }}>불러오는 중...</div>
      </Layout>
    );
  }

  if (!member) {
    return (
      <Layout bg>
        <Header title="프로필" showBack onBack={() => navigate(-1)} bg />
        <div style={{ padding: 40, textAlign: "center" }}>
          프로필 정보를 불러올 수 없습니다.
        </div>
      </Layout>
    );
  }

  const infoList = [
    { label: "성별", value: member.gender === "MALE" ? "남성" : "여성" },
    { label: "나이", value: `${member.ageGroup}대` },
    { label: "주소", value: member.address },
    {
      label: "주요 도움",
      value:
        member.helpCategories && member.helpCategories.length > 0
          ? member.helpCategories.join(", ")
          : "-",
    },
    { label: "한줄소개", value: member.introduction || "-" },
  ];

  return (
    <Layout bg>
      <Header title="프로필" showBack onBack={() => navigate(-1)} bg />

      <ScrollContainer>
        <Info>
          <Top>
            <ProfileImageWrapper>
              <ProfileImage
                src={member.profileImageUrl || defaultProfileImage}
                alt="프로필"
              />
            </ProfileImageWrapper>

            <TopRight>
              <NickName>{member.nickname}</NickName>
              {member.role === "HELPER" &&
                member.badges &&
                member.badges.length > 0 && (
                  <BadgeWrapper>
                    <BadgeChips badges={member.badges} />
                  </BadgeWrapper>
                )}
            </TopRight>
          </Top>

          <Divider />

          <Bottom>
            {infoList.map(({ label, value }) => (
              <InfoRow key={label}>
                <InfoLabel>{label}</InfoLabel>
                <InfoValue>{value ?? "-"}</InfoValue>
              </InfoRow>
            ))}
          </Bottom>

          <ProfileModifyButton>프로필 수정</ProfileModifyButton>
        </Info>

        <ReceivedReview mode="me" />
      </ScrollContainer>
    </Layout>
  );
};

export default ProfileInfoPage;

/* ================= styled ================= */

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;

  /* iOS 스크롤 자연스럽게 */
  -webkit-overflow-scrolling: touch;
`;
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

const Divider = styled.div`
  width: 100%;
  height: 0.5px;
  background: ${({ theme }) => theme.color.natural200};
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
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.4;
  word-break: break-word;
`;

const ProfileModifyButton = styled.button`
  display: flex;
  width: 100%;
  margin: 20px auto 16px auto;
  justify-content: center;
  background-color: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.subText2};
  padding: 14px 0;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  cursor: pointer;
`;
