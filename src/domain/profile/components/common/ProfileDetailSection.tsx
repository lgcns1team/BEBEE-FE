import { useParams } from "react-router-dom";
import { useUserStore } from "../../../../store/useUserStore";

import styled from "styled-components";
const ProfileDetailSection = () => {
  const { profileId } = useParams<{ profileId: string }>();

  const { role, disabledProfiles, helperProfiles } = useUserStore();

  const id = Number(profileId);

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
    <Info>
      <Top>
        <ProfileImage src={profile?.profileImageUrl} />
        <TopRight>
          <NickName>{profile?.nickname}</NickName>

          {role === "HELPER" && (
            <>
              <SubName>@시각 장애인 전문가</SubName>
              <SubName>@발달 장애인 전문가</SubName>
            </>
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

// const ExperienceSection = styled.div`
//   background-color: ${({ theme }) => theme.color.white};
//   border-radius: ${({ theme }) => theme.borderRadius.lg};
//   width: 100%;
//   margin-top: 20px;
//   padding: 20px;
//   display: flex;
//   flex-direction: column;
//   gap: 12px;
// `;

// const Title = styled.div`
//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.bold};
// `;

// const ExperienceType = styled.div`
//   font-size: ${({ theme }) => theme.size.sm};
//   background-color: ${({ theme }) => theme.color.subColor};
//   border-radius: ${({ theme }) => theme.borderRadius.md};
//   padding: 8px 12px;
//   display: flex;
//   justify-content: space-between;
// `;

// const ExperienceContent = styled.div`
//   font-size: ${({ theme }) => theme.size.md};
// `;

// const ExperienceInfo = styled.div`
//   font-size: ${({ theme }) => theme.size.sm};
//   color: ${({ theme }) => theme.color.subText2};
// `;

// const ExperienceDescription = styled.div`
//   font-size: ${({ theme }) => theme.size.sm};
//   border: 1px solid ${({ theme }) => theme.color.main};
//   border-radius: ${({ theme }) => theme.borderRadius.md};
//   padding: 12px;
// `;
