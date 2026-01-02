// src/components/MatchingPostCard.tsx
import styled from "styled-components";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { BsPencil, BsChat } from "react-icons/bs";

import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";
import { useNavigate } from "react-router-dom";

//hook
import { useChatHandler } from "../../../../hooks/useChatHandler";

import type { Engagement } from "../../../../types/match.type";
import { formatDateWithDay } from "../../utils/dateFormat";
import type {
  DayEngagementTime,
  TermEngagementTime,
} from "../../../../types/match.type";

interface Props {
  engagement: Engagement;
}

const MatchingPostCard = ({ engagement }: Props) => {
  const navigate = useNavigate();

  const isCompleted =
    engagement.type === "DAY"
      ? engagement.isDayComplete
      : engagement.isTermComplete;
  const goMatchingInfo = () => {
    if (!engagement) return;
    navigate(`/match-info/${engagement.agreementId}`);
  };

  const goReviewPage = () => {
    navigate(`/review`);
  };

  /* 채팅 관련 */
  const { handleChatOpen } = useChatHandler();

  const MY_ID = "100";

  const matchingItem = {
    id: 1,
    chatroomId: "791458418405204700",
    partnerNickname: "꿀벌님",
  };

  const goChatPage = () => {
    console.log("기존 채팅방 조회 및 이동 시도...");
    handleChatOpen(MY_ID, { chatroomId: matchingItem.chatroomId });
  };

  return (
    <Card>
      {/* ---------- Top ---------- */}
      <TopArea>
        <Title onClick={goMatchingInfo} aria-label="매칭된 도움의 제목">
          {engagement.title}
        </Title>
        {engagement.type === "DAY" && <OneDayBadge>하루 도움</OneDayBadge>}
      </TopArea>

      {/* ---------- Bottom ---------- */}
      <BottomArea>
        {/* 왼쪽 정보 */}
        <BottomLeft>
          <User aria-label="장애인의 닉네임">
            {engagement.disabled.nickname}
          </User>

          <InfoLine>
            <MapPinIcon size={16} aria-label="활동 지역 아이콘" />
            <InfoText aria-label="활동 지역">{engagement.region}</InfoText>
          </InfoLine>

          <InfoLine>
            <CalendarIcon size={16} aria-label="날짜 아이콘" />
            <InfoText aria-label="활동 날짜">
              {engagement.type === "DAY" && (
                <>
                  {formatDateWithDay(
                    (engagement.engagementTime as DayEngagementTime).date
                  )}
                </>
              )}

              {engagement.type === "TERM" && (
                <>
                  {formatDateWithDay(
                    (engagement.engagementTime as TermEngagementTime).startDate
                  )}
                  {" ~ "}
                  {formatDateWithDay(
                    (engagement.engagementTime as TermEngagementTime).endDate
                  )}
                </>
              )}
            </InfoText>
          </InfoLine>

          <TagRow>
            {engagement.helpCategories.map((category) => (
              <HelpTag key={category.helpCategoryId} aria-label="활동 카테고리">
                {category.helpCategoryName}
              </HelpTag>
            ))}
          </TagRow>
        </BottomLeft>

        {/* 오른쪽 이미지 */}
        {engagement.thumbnailImageUrl && (
          <BottomRight>
            <Thumbnail>
              <img src={engagement.thumbnailImageUrl} alt="활동 관련 이미지" />
            </Thumbnail>
          </BottomRight>
        )}
      </BottomArea>

      {/* ---------- Buttons ---------- */}
      <BottomBar>
        <BottomInner>
          <ChatButton onClick={goChatPage} aria-label="채팅하기로 이동합니다.">
            <BsChat size={12} />
            <span>채팅하기</span>
          </ChatButton>

          {isCompleted ? (
            <DoneButton aria-label="활동이 완료 되었다면 홛동 완료 버튼을 눌러주세요">
              <span>활동 완료</span>
            </DoneButton>
          ) : (
            <ReviewButton
              onClick={goReviewPage}
              aria-label="리뷰를 작성하려면 리뷰 작성하기 버튼을 눌러주세요"
            >
              <BsPencil size={12} />
              <span>리뷰 작성하기</span>
            </ReviewButton>
          )}
        </BottomInner>
      </BottomBar>
    </Card>
  );
};

export default MatchingPostCard;

/* ---------------- styled ---------------- */

const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  background: ${({ theme }) => theme.color.white};
`;

const TopArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BottomArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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
`;

const User = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  margin-bottom: 6px;
`;

const InfoLine = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
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
  span {
    margin-left: 4px;
  }
`;

const ReviewButton = styled(DoneButton)`
  background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
`;
