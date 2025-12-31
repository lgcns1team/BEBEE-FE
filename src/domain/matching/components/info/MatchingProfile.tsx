import Bee from "../../../../assets/images/helptag-bee.png";
import styled from "styled-components";
import { SlArrowRight } from "react-icons/sl";
const MatchingProfile = () => {
  return (
    <Wrapper>
      <Left>
        <ProfileImage src={Bee} />

        <InfoBox>
          <Name></Name>
          <SubInfo>남성&nbsp;&nbsp;·&nbsp;&nbsp;나이 비공개</SubInfo>
        </InfoBox>
      </Left>

      <ArrowWrapper>
        <SlArrowRight size={18} color="#000" />
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
