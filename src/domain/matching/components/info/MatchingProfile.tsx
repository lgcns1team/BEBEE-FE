import styled from "styled-components";
import { SlArrowRight } from "react-icons/sl";
import type { Engagement } from "../../../../types/match";
interface Props {
  engagement: Engagement;
}

const MatchingProfile = ({ engagement }: Props) => {
  const gender = engagement.helper.gender === "MALE" ? "남성" : "여성";
  return (
    <Wrapper>
      <Left>
        <ProfileImage
          src={engagement.helper.profileImageUrl}
          alt="사용자 프로필 사진"
        />

        <InfoBox>
          <Name aria-label="닉네임">{engagement.helper.nickname}</Name>
          <SubInfo aria-label="성별 및 나이">
            {gender}&nbsp;&nbsp;·&nbsp;&nbsp;
            {engagement.helper.ageGroup}대
          </SubInfo>
        </InfoBox>
      </Left>

      <ArrowWrapper>
        <SlArrowRight size={18} color="#000" aria-label="프로필 정보로 이동" />
      </ArrowWrapper>
    </Wrapper>
  );
};

export default MatchingProfile;

/* ---------------- Styled Components ---------------- */

const Wrapper = styled.div`
  width: 95%;
  margin: 20px auto;
  padding: 16px;
  border: 0.5px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;

const SubInfo = styled.div`
  margin-top: 4px;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const ArrowWrapper = styled.div`
  display: flex;
  align-items: center;
`;
