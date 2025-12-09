import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../../components/Header";
import { FaDroplet } from "react-icons/fa6";
import InfoRow from "../components/list/InfoRow";
import Bee from "../../../assets/images/helptag-bee.png";
import ProfileHelpPostCard from "../components/list/ProfileHelpPostCard";

const dummyPosts = [
  {
    id: 1,
    title: "동그라미 친 맛으로 사다 주세요!",
    honey: 130,
    place: "역촌동",
    done: false,
  },
  {
    id: 2,
    title: "암막 커튼 샀는데 달 수가 없어요 ㅠㅠ",
    honey: 80,
    place: "구산동",
    done: true,
  },
];

const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <Header title="프로필 정보" onBack={() => navigate(-1)} />

      {/* ----------- 프로필 영역 ----------- */}
      <Info>
        <Top>
          <ProfileImage src={Bee} />
          <TopRight>
            <NickName>박위</NickName>
            <SubName>@활발한 꽃잎</SubName>

            <Honey>
              <FaDroplet size={12} />
              <span>당도 40.5</span>
            </Honey>
          </TopRight>
        </Top>

        <Bottom>
          <InfoRow label="성별" value="남성" />
          <InfoRow label="나이" value="비공개" />
          <InfoRow label="주소" value="서울시 강남구 역삼동" />
          <InfoRow label="주요 도움" value="이동 지원, 의료동행" />
          <InfoRow
            label="한줄소개"
            value="안녕하세요 도움 받고 싶습니다. 잘 부탁드립니다."
          />
        </Bottom>
      </Info>

      {/* ----------- 장애 설명 영역 ----------- */}
      <Description>
        <Title>이런 불편함이 있어요</Title>

        <DisabilityType>
          <span>지체장애</span>
        </DisabilityType>

        <TypeDescription>
          <span>
            하반신 마비 후 얼마 지나지 않아 휠체어 사용이 아직 익숙하지
            않습니다. 여러모로 도움 받고 싶습니다. 휠체어 보조 경험이 있는
            분이면 더 좋을 것 같습니다.
          </span>
        </TypeDescription>
      </Description>

      {/* ----------- 도움 요청글 ----------- */}
      <HelpPost>
        <HelpPostHeader>
          <HelpLabel>
            <Label>도움 요청글</Label>
            <Count>3</Count>
          </HelpLabel>
          <SeeMore>더보기</SeeMore>
        </HelpPostHeader>

        <PostList>
          {dummyPosts.map((post) => (
            <ProfileHelpPostCard
              key={post.id}
              title={post.title}
              honey={post.honey}
              place={post.place}
              done={post.done}
            />
          ))}
        </PostList>
      </HelpPost>
    </Wrapper>
  );
};

export default ProfilePage;

/* ---------------- Styled ---------------- */

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.color.natural50};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
`;

const Info = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 90%;
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

const Honey = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  gap: 6px;
  color: ${({ theme }) => theme.color.main};
  span {
    font-size: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.text};
  }
`;

const Bottom = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Description = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 90%;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const DisabilityType = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  background-color: ${({ theme }) => theme.color.subColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 8px 12px;
`;

const TypeDescription = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 12px;
`;

const HelpPost = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 90%;
  margin-top: 20px;
  padding: 16px;
`;

const HelpPostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const HelpLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const Count = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const SeeMore = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const PostList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
`;
