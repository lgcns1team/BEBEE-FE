// components/info/MatchingProfile.tsx
import styled from "styled-components";
import { SlArrowRight } from "react-icons/sl";
import type { EngagementDetail } from "../../../../types/match.type";

interface Props {
  engagement: EngagementDetail;
}

const MatchingProfile = ({ engagement }: Props) => {
  return (
    <Wrapper>
      <Left>
        <ProfileImage src={engagement.otherProfileImageUrl} />
        <InfoBox>
          <Name>{engagement.otherNickname}</Name>
          <SubInfo>
            {engagement.otherGender} · {engagement.otherAgeGroup}대
          </SubInfo>
        </InfoBox>
      </Left>

      <SlArrowRight size={18} />
    </Wrapper>
  );
};

export default MatchingProfile;

/* styled */
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  margin: 20px auto;
  width: 95%;
  border: 0.5px solid ${({ theme }) => theme.color.main};
  border-radius: 12px;
`;

const Left = styled.div`
  display: flex;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
`;

const InfoBox = styled.div``;

const Name = styled.div`
  font-weight: bold;
`;

const SubInfo = styled.div`
  color: ${({ theme }) => theme.color.subText2};
`;
