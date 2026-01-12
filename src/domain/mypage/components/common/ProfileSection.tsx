import styled from "styled-components";
import Image from "../../../../assets/images/helptag-bee.png";
import { IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../../store/useUserStore";
import { useProfileStore } from "../../../../store/useProfileStore";
import { useEffect } from "react";

const ProfileSection = () => {
  const navigate = useNavigate();
  const profile = useProfileStore((state) => state.profile);



  const handleClick = () => {
    if (!profile) {
      console.log("회원 정보 없음!")
      return;
    }
    navigate("/profile-info");
  };

  useEffect(() =>{
    const fetchProfile = async () =>{
      try{
        const response = await
      }
    }
  })

  return (
    <Container onClick={handleClick}>
      <ProfileWrapper>
        <ProfileImage
          src={profile?.profileImageUrl ?? Image}
          alt="프로필 이미지"
        />
        <Nickname>{profile?.nickname}</Nickname>
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
