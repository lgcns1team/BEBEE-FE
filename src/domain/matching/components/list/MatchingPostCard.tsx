// src/components/MatchingPostCard.tsx
import styled from "styled-components";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { BsPencil, BsChat } from "react-icons/bs";
import type { Post } from "../../../../store/usePostStore";
import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";
import { useNavigate } from "react-router-dom";

//hook
import { useChatHandler } from "../../../../hooks/useChatHandler";

interface Props {
  post: Post;
}

const MatchingPostCard = ({ post }: Props) => {
  const navigate = useNavigate();
  const goReview = () => {
    navigate("/review");
  };
  const goMatchingInfo = () => {
    navigate(`/match-info/${post.id}`);
  };

  /* 채팅 관련 */
  const { handleChatOpen } = useChatHandler();

  const MY_ID = 100;

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
    <Card onClick={goMatchingInfo}>
      {/* ---------- Top ---------- */}
      <TopArea>
        <Title>{post.title}</Title>
        {post.category === "하루 도움" && <OneDayBadge>하루 도움</OneDayBadge>}
      </TopArea>

      {/* ---------- Bottom ---------- */}
      <BottomArea>
        {/* 왼쪽 정보 */}
        <BottomLeft>
          <User>{post.user}</User>

          <InfoLine>
            <MapPinIcon size={16} />
            <InfoText>{post.location}</InfoText>
          </InfoLine>

          <InfoLine>
            <CalendarIcon size={16} />
            {post.dates?.map((date) => (
              <InfoText key={date}>{date}</InfoText>
            ))}
          </InfoLine>

          <TagRow>
            {post.tags.map((tag) => (
              <HelpTag key={tag}>{tag}</HelpTag>
            ))}
          </TagRow>
        </BottomLeft>

        {/* 오른쪽 이미지 */}
        {post.image && (
          <BottomRight>
            <Thumbnail>
              <img src={post.image} alt="thumbnail" />
            </Thumbnail>
          </BottomRight>
        )}
      </BottomArea>

      {/* ---------- Buttons ---------- */}
      <BottomBar>
        <BottomInner>
          <ChatButton onClick={goChatPage}>
            <BsChat size={12} />
            <span>채팅하기</span>
          </ChatButton>

          {post.done ? (
            <ReviewButton onClick={goReview}>
              <BsPencil size={12} />
              <span>리뷰 보내기</span>
            </ReviewButton>
          ) : (
            <DoneButton>활동 완료</DoneButton>
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
