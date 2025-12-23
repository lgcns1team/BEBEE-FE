import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../../components/Header";
import Image from "../../../assets/images/helptag-bee.png";
import HoneyBadge from "../../../components/HoneyBadge";
import MyPageInfoRow from "../components/common/list/MyPageInfoRow";
// 활발한 꽃잎, 친절한 꿀벌만 조건부 렌더링 필요
const MyProfilePage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <Header title="프로필" onBack={() => navigate(-1)} bg />
      <ProfileWrapper>
        <Top>
          <ProfileImage src={Image} />

          <TopRight>
            <NickName>응암꿀벌</NickName>
            <SubNickName>@친절한 꿀벌</SubNickName>
            <HoneyBadge>당도 40.5</HoneyBadge>
          </TopRight>
        </Top>
        <Divider />
        <Bottom>
          <MyPageInfoRow label="성별" value="여성" />
          <MyPageInfoRow label="나이" value="22세" />
          <MyPageInfoRow label="주소" value="서울시 강남구 역삼동" />
          <MyPageInfoRow label="주요 도움" value="이동지원, 방문 목욕" />
          <MyPageInfoRow
            label="한줄소개"
            value="장애인 분들에게 도움이 되고 싶어요!"
          />
        </Bottom>

        <ProfileModifyButton>프로필 수정</ProfileModifyButton>
      </ProfileWrapper>
    </Container>
  );
};

export default MyProfilePage;

const Container = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.natural50};
`;

const ProfileWrapper = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  min-height: 45vh;
  padding: 0 16px 16px 16px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;
const Top = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 16px;
`;
const ProfileImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 12px;
`;

const TopRight = styled.div`
  display: flex;
  flex-direction: column;
`;

const NickName = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 4px;
`;

const SubNickName = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  margin-bottom: 12px;
`;

const Divider = styled.div`
  width: 100%;
  height: 0.5px;
  background: ${({ theme }) => theme.color.natural200};
`;
const Bottom = styled.div`
  margin-top: 16px;
`;

const ProfileModifyButton = styled.button`
  display: flex;
  width: 100%;
  margin: 40px auto 16px auto;
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
