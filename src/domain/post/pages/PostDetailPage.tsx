import styled from "styled-components";
import { useState } from "react";
import { FiChevronLeft, FiMoreVertical } from "react-icons/fi";
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi";
import { FaDroplet } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { RxIconjarLogo } from "react-icons/rx";
import ActionSheetModal from "../components/common/ActionSheetModal";
import HelpTagBee from "../../../assets/images/helptag-bee.png";
import Layout from "../../../components/Layout";

const PostDetailPage = () => {
  const navigate = useNavigate();
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  return (
    <Layout>
      <Wrapper>
        {/* ---------------- Header ---------------- */}
        <TopBar>
          <FiChevronLeft size={24} onClick={() => navigate(`/`)} />

          <RightArea>
            <FiMoreVertical
              size={22}
              onClick={() => setIsActionSheetOpen(true)}
            />
          </RightArea>
        </TopBar>

        <ActionSheetModal
          isOpen={isActionSheetOpen}
          onClose={() => setIsActionSheetOpen(false)}
        />
        {/* ---------------- Category Tags ---------------- */}
        <TagList>
          <HelpBeeImage src={HelpTagBee} alt="bee" />
          <Tag>이동지원</Tag>
          <Tag>의료동행</Tag>
        </TagList>

        {/* ---------------- Title ---------------- */}
        <Title>집에서 병원까지 픽드랍 필요해요</Title>

        {/* ---------------- User Info ---------------- */}
        <UserSection>
          <UserLeft>
            <UserImage
              src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fnamu.wiki%2Fw%2F%25ED%2594%2584%25EB%25A1%259C%25ED%2595%2584%2520%25EC%2582%25AC%25EC%25A7%2584%2F%25EC%259D%25B8%25ED%2584%25B0%25EB%2584%25B7&psig=AOvVaw0DFekrzGQ3crLC2zHdaMua&ust=1764684147691000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCODW1fLGnJEDFQAAAAAdAAAAABAE"
              alt="user profile"
            />
            <UserInfo>
              <UserName>박원</UserName>
              <UserAddress>갈현 제2동</UserAddress>
            </UserInfo>
          </UserLeft>

          <Temperature>
            60.7 당도 <DropletIcon size={16} />
          </Temperature>
        </UserSection>

        <Divider />

        {/* ---------------- Info List ---------------- */}
        <InfoList>
          <InfoItem>
            <RxIconjarLogo size={16} />
            <span>150 꿀</span>
          </InfoItem>

          <InfoItem>
            <FiCalendar size={16} />
            <span>2025년 11월 21일 (수)</span>
          </InfoItem>

          <InfoItem>
            <FiClock size={16} />
            <span>11시–14시</span>
          </InfoItem>

          <InfoItem>
            <FiMapPin size={16} />
            <span>신촌동</span>
          </InfoItem>
        </InfoList>

        {/* ---------------- Description ---------------- */}
        <Description>
          매주 혼자 병원을 가는 게 벅차서 도우미 구합니다. 휠체어가 들어가는 SUV
          차량 이상이었으면 좋겠어요. 왕복으로 지원해주셔야 합니다. 왔다갔다
          하는 시간 + 진료 보는 시간 총 3시간 정도 걸려요. 신촌동 부근으로
          오시면 되고 자세한 주소는 채팅으로 말씀드리겠습니다. 병원은
          은평세브란스병원입니다!
        </Description>

        <ApplicantCount>지원자 수 13</ApplicantCount>

        {/* ---------------- Bottom Buttons ---------------- */}
        <BottomBar>
          <BottomInner>
            <ShareButton>나눔하기</ShareButton>
            <ApplyButton>지원하기</ApplyButton>
          </BottomInner>
        </BottomBar>
      </Wrapper>
    </Layout>
  );
};

export default PostDetailPage;

/* ---------------------------------------------
   styled-components
--------------------------------------------- */

const Wrapper = styled.div`
  max-width: 430px;
  margin: 0 auto;
  min-height: 100vh;
  background: ${({ theme }) => theme.color.white};
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
`;
const RightArea = styled.div`
  margin-left: auto; /* 오른쪽으로 밀기 */
  display: flex;
  align-items: center;
`;
const HelpBeeImage = styled.img`
  width: 16px;
  height: 16px;
  object-fit: contain;
  margin-right: 2px;
`;

const TagList = styled.div`
  display: flex;
  gap: 6px;
  padding: 0px;
`;

const Tag = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.main};

  font-weight: ${({ theme }) => theme.weight.medium};
`;

const Title = styled.h1`
  padding: 16px 0px;
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.3;
`;

const UserSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 0px 16px 0px;
  align-items: center;
`;

const UserLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const UserImage = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
`;

const UserAddress = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
`;

const Temperature = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.main};
  display: flex;
  align-items: center;
  gap: 4px;
`;
const DropletIcon = styled(FaDroplet)`
  color: ${({ theme }) => theme.color.main};
`;
const Divider = styled.div`
  width: 100%;
  height: 0.5px;
  background: ${({ theme }) => theme.color.natural200};
`;

const InfoList = styled.div`
  padding: 16px 0px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoItem = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const Description = styled.p`
  padding: 16px 0px;
  font-size: ${({ theme }) => theme.size.md};
  color: #333;
  line-height: 1.6;
`;

const ApplicantCount = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  padding: 0;
  margin-bottom: 12px;
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  width: 100%;
  background: ${({ theme }) => theme.color.white};

  display: flex;
  justify-content: center;
  padding: 12px 0;
`;

const BottomInner = styled.div`
  width: 100%;
  max-width: 345px;
  display: flex;
  gap: 12px;
`;

const ShareButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 0.5px solid ${({ theme }) => theme.color.natural200};
  font-size: ${({ theme }) => theme.size.sm};
  background: ${({ theme }) => theme.color.white};
  font-weight: ${({ theme }) => theme.weight.medium};
  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
`;

const ApplyButton = styled.button`
  flex: 2;
  height: 48px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.size.sm};
  border: none;
  font-weight: ${({ theme }) => theme.weight.medium};
`;
