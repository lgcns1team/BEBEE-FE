import React from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../../../store/useUserStore";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import ReceivedReview from "../../profile/components/common/ReceivedReview";
const ProfileInfoPage = () => {
  const navigate = useNavigate();
  const { infoId } = useParams<{ infoId: string }>();

  const { role, disabledProfiles, helperProfiles } = useUserStore();

  const id = Number(infoId);

  const profile =
    role === "DISABLED"
      ? disabledProfiles.find((p) => p.memberId === id)
      : helperProfiles.find((p) => p.memberId === id);

  const infoList = [
    { label: "성별", value: profile?.gender },
    { label: "나이", value: profile?.age },
    { label: "주소", value: profile?.addressRoad },
    { label: "주요 도움", value: profile?.helpType?.join(", ") },
    { label: "한줄소개", value: profile?.introduction },
  ];
  return (
    <Layout bg>
      <Header title="프로필" onBack={() => navigate(-1)} bg />
      <Info>
        <Top>
          <ProfileImage src={profile?.profileImageUrl} />
          <TopRight>
            <NickName>{profile?.name}</NickName>

            {role === "HELPER" && (
              <>
                <SubName>@시각 장애인 전문가</SubName>
                <SubName>@발달 장애인 전문가</SubName>
              </>
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
      <ReceivedReview profileId={profile?.memberId} />
    </Layout>
  );
};

export default ProfileInfoPage;

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

const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
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

const SubName = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
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
