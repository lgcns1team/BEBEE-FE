import styled from "styled-components";
import santaImage from "../../../../assets/images/bee-santa.png";
import { IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMemberStore } from "../../../../store/useMemberStore";

const ProfileSection = () => {
  const navigate = useNavigate();
  const { member, fetchMember } = useMemberStore();

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);



  const handleClick = () => {
    if (!member) {
      console.log("회원 정보 없음!");
      return;
    }
    navigate("/profile-info");
  };

  const profileImageUrl = member?.profileImageUrl || santaImage;
  const nickname = member?.nickname || "";

  return (
    <Container onClick={handleClick}>
      <ProfileWrapper>
        <ProfileImage src={profileImageUrl} alt="프로필 이미지" />
        <Nickname>{nickname}</Nickname>
      </ProfileWrapper>

      <GoProfile>
        <IoChevronForward size={24} color="#A1A1A1" />
      </GoProfile>
    </Container>
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
