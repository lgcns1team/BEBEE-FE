import { useEffect, useState } from "react";
import styled from "styled-components";
import Image from "../../../../assets/images/helptag-bee.png";
import { IoChevronForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../../store/useUserStore";
import { useProfileStore } from "../../../../store/useProfileStore";

const ProfileSection = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("프로필");
  const { role, disabledProfiles, helperProfiles } = useProfileStore();
  // 일단은 맨 첫번째 유저의 정보 보여줌
  const profile = role === "DISABLED" ? disabledProfiles[0] : helperProfiles[0];

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    console.log("/////user값 확인/////");
    console.log(user);
    if (!user) return;
    setUserName(user.name);
  }, [user]);

  const handleClick = () => {
    if (!profile) return;
    navigate(`/profile-info/${profile.memberId}`);
  };

  return (
    <Container onClick={handleClick}>
      <ProfileWrapper>
        <ProfileImage
          src={profile?.profileImageUrl ?? Image}
          alt="프로필 이미지"
        />
        <Nickname>{userName}</Nickname>
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
