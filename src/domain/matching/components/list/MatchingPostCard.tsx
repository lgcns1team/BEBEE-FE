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
  const scheduleText = getScheduleText(
    engagement.helpType,
    engagement.date,
    engagement.dayOfWeeks
  );
  // 매칭 확인서 이동
  const goMatchingInfo = () => {
    navigate(`/match-info/${engagement.agreementId}`);
  };

  const goChatPage = () => {
    handleChatOpen({ chatroomId: engagement.chatRoomId });
  };
  const handleProfileClick = () => {
    navigate(`/profile/${engagement.otherId}`);
  };
  // 스크린 리더용
  const cardAriaLabel = `
    활동 제목 ${engagement.title}.
    매칭 상대 ${engagement.otherNickname}.
    활동 지역 ${engagement.region}.
    도움 날짜 ${scheduleText}.
    ${
      engagement.helpType === "DAY"
        ? "하루 도움 활동입니다."
        : "지속 도움 활동입니다."
    }
    매칭 확인서를 확인하려면 두 번 탭하세요.
  `;
  const renderActionButton = () => {
    switch (engagement.status) {
      case "INACTIVE":
        return (
          <InactiveButton disabled tabIndex={0}>
            활동 전
          </InactiveButton>
        );

      case "ACTIVE":
        return (
          <DoneButton
            onClick={() => onComplete(engagement.engagementId)}
            aria-label="활동을 완료 처리 합니다. 완료 처리 후 리뷰를 작성할 수 있습니다."
          >
            활동 완료
          </DoneButton>
        );

      case "COMPLETED":
        return (
          <CompletedButton
            disabled
            aria-label="이미 활동 완료 처리가 되었습니다."
          >
            활동 완료
          </CompletedButton>
        );

      case "REVIEW_ACTIVE":
        return (
          <ReviewButton
            onClick={() => navigate(`/review/${engagement.matchId}`)}
            aria-label="리뷰 작성 페이지로 이동합니다"
          >
            <BsPencil size={12} aria-hidden="true" />
            리뷰 작성하기
          </ReviewButton>
        );

      case "REVIEW_COMPLETED":
        return (
          <ReviewButton disabled aria-label="이미 리뷰를 작성한 활동 입니다.">
            리뷰 작성 완료
          </ReviewButton>
        );

      default:
        return null;
    }
  };

  return (
    <Card role="button" aria-label={cardAriaLabel} tabIndex={0} >
      <div aria-hidden="true">
        <TopArea>
          <Title
            onClick={goMatchingInfo}
            aria-label={`활동 제목 ${engagement.title} 입니다. 매칭 상세 정보로 이동합니다`}
          >
            {engagement.title}
          </Title>
          {engagement.helpType === "DAY" && (
            <OneDayBadge aria-label="하루 도움에 해당하는 활동입니다">
              하루 도움
            </OneDayBadge>
          )}
        </TopArea>

        <BottomArea>
          <BottomLeft>
            <User
              role="button"
              tabIndex={0}
              onClick={handleProfileClick}
              aria-label={`매칭된 상대 ${engagement.otherNickname} 님의 프로필로 이동합니다`}
            >
              {engagement.otherNickname}
            </User>

            <InfoLine>
              <MapPinIcon size={16} aria-hidden="true" />
              <InfoText aria-label={`활동 지역 ${engagement.region} 입니다`}>
                {engagement.region}
              </InfoText>
            </InfoLine>

            <InfoLine>
              <CalendarIcon size={16} aria-hidden="true" />
              <InfoText aria-label={`도움 날짜 ${scheduleText} 입니다`}>
                {scheduleText}
              </InfoText>
            </InfoLine>

            <TagRow aria-label="도움 유형 태그 목록">
              {engagement.helpCategoryIds.map((cat) => (
                <HelpTag key={cat}>{HELP_TAG_MAP[cat]}</HelpTag>
              ))}
            </TagRow>
          </BottomLeft>

          {engagement.thumbnailImageUrl && (
            <BottomRight>
              <Thumbnail>
                <img
                  src={engagement.thumbnailImageUrl}
                  alt="활동과 관련된 이미지 입니다"
                />
              </Thumbnail>
            </BottomRight>
          )}
        </BottomArea>
      </div>
      <BottomBar>
        <BottomInner>
          <ChatButton
            onClick={goChatPage}
            aria-label="채팅 화면으로 이동합니다"
          >
            <BsChat size={12} aria-hidden="true" />
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
  padding-bottom: 20px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  cursor: pointer;
  // 마우스 클릭시에는 안보이고 키보드/보조기기 사용자에게만 표시됩니다.
  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.main};
    outline-offset: 2px;
  }
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
  margin-top: 20px;
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
   color: ${({ theme }) => theme.color.text};
  -webkit-text-fill-color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};
  appearance: none;
  -webkit-appearance: none;
  span {
    margin-left: 4px;
    color: inherit;                
    -webkit-text-fill-color: inherit;
  }
`;

const DoneButton = styled.button`
  flex: 2;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  border: none;
  font-size: ${({ theme }) => theme.size.md};
`;

const CompletedButton = styled(DoneButton)`
  background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.size.md};
`;

const InactiveButton = styled(DoneButton)`
  background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

const ReviewButton = styled(DoneButton)`
  background: ${({ theme }) => theme.color.subColor};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
`;

