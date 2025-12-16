import styled from "styled-components";
import Image from "../../../../assets/images/helptag-bee.png";
import HoneyBadge from "../../../../components/HoneyBadge";
import { IoChevronForward } from "react-icons/io5";
const ProfileSection = () => {
  return (
    <div>
      <Container>
        <ProfileWrapper>
          <ProfileImage src={Image} />
          <Nickname>응암꿀벌</Nickname>
          <HoneyBadge>당도 40.5</HoneyBadge>
        </ProfileWrapper>
        <GoProfile>
          <IoChevronForward size={24} color="#A1A1A1" />
        </GoProfile>
      </Container>
    </div>
  );
};

export default ProfileSection;

const Container = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;
const Nickname = styled.span`
  font-size: ${({ theme }) => theme.size.md};
`;
const GoProfile = styled.div`
  display: flex;
  align-items: center;
`;
