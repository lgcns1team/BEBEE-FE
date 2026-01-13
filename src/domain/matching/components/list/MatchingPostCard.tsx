import styled from "styled-components";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { BsPencil, BsChat } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";

import { useChatHandler } from "../../../../hooks/useChatHandler";
import type { Engagement } from "../../../../types/match.type";

import { HELP_TAG_MAP } from "../../../../constants/helpTags";
import { getScheduleText } from "../../../../types/common.types";

interface Props {
  engagement: Engagement;
  onComplete: (engagementId: string) => void;
}

const MatchingPostCard = ({ engagement, onComplete }: Props) => {
  const navigate = useNavigate();
  const { handleChatOpen } = useChatHandler();

  // 매칭 확인서 이동
  const goMatchingInfo = () => {
    navigate(`/match-info/${engagement.agreementId}`);
  };

  const goChatPage = () => {
    handleChatOpen({ chatroomId: engagement.chatRoomId });
  };

  const renderActionButton = () => {
    switch (engagement.status) {
      case "INACTIVE":
        return <InactiveButton disabled>활동 전</InactiveButton>;

      case "ACTIVE":
        return (
          <DoneButton onClick={() => onComplete(engagement.engagementId)}>
            활동 완료
          </DoneButton>
        );

      case "COMPLETED":
        return <CompletedButton disabled>활동 완료</CompletedButton>;

      case "REVIEW_ACTIVE":
        return (
          <ReviewButton
            onClick={() => navigate(`/review/${engagement.matchId}`)}
          >
            <BsPencil size={12} />
            리뷰 작성하기
          </ReviewButton>
        );

      case "REVIEW_COMPLETED":
        return <ReviewButton disabled>리뷰 작성 완료</ReviewButton>;

      default:
        return null;
    }
  };

  return (
    <Card>
      <TopArea>
        <Title onClick={goMatchingInfo}>{engagement.title}</Title>
        {engagement.helpType === "DAY" && <OneDayBadge>하루 도움</OneDayBadge>}
      </TopArea>

      <BottomArea>
        <BottomLeft>
          <User>{engagement.otherNickname}</User>

          <InfoLine>
            <MapPinIcon size={16} />
            <InfoText>{engagement.region}</InfoText>
          </InfoLine>

          <InfoLine>
            <CalendarIcon size={16} />
            <InfoText>
              {getScheduleText(
                engagement.helpType,
                engagement.date,
                engagement.dayOfWeeks
              )}
            </InfoText>
          </InfoLine>

          <TagRow>
            {engagement.helpCategoryIds.map((cat) => (
              <HelpTag key={cat}>{HELP_TAG_MAP[cat]}</HelpTag>
            ))}
          </TagRow>
        </BottomLeft>

        {engagement.thumbnailImageUrl && (
          <BottomRight>
            <Thumbnail>
              <img src={engagement.thumbnailImageUrl} alt="활동 이미지" />
            </Thumbnail>
          </BottomRight>
        )}
      </BottomArea>

      <BottomBar>
        <BottomInner>
          <ChatButton onClick={goChatPage}>
            <BsChat size={12} />
            <span>채팅하기</span>
          </ChatButton>

          {renderActionButton()}
        </BottomInner>
      </BottomBar>
    </Card>
  );
};

export default MatchingPostCard;

/* ================= styled ================= */

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 40px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
`;

const TopArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BottomArea = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const BottomLeft = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BottomRight = styled.div`
  flex-shrink: 0;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  cursor: pointer;
`;

const User = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
`;

const InfoLine = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const InfoText = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const MapPinIcon = styled(FiMapPin)`
  color: ${({ theme }) => theme.color.subText2};
`;

const CalendarIcon = styled(FiCalendar)`
  color: ${({ theme }) => theme.color.subText2};
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 6px;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const BottomBar = styled.div`
  padding-top: 8px;
`;

const BottomInner = styled.div`
  display: flex;
  gap: 12px;
`;

const ChatButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 0.5px solid ${({ theme }) => theme.color.natural200};
  background: ${({ theme }) => theme.color.white};

  span {
    margin-left: 4px;
  }
`;

const DoneButton = styled.button`
  flex: 2;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  border: none;
`;

const CompletedButton = styled(DoneButton)`

  background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`

const InactiveButton = styled(DoneButton)`
background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  
`

const ReviewButton = styled(DoneButton)`
  background: ${({ theme }) => theme.color.subColor};
  color: ${({ theme }) => theme.color.text};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;
