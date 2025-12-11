// src/components/PostCard.tsx
import styled from "styled-components";
import { FiCalendar } from "react-icons/fi";
import { BsPencil } from "react-icons/bs";
import { BsChat } from "react-icons/bs";
import type { Post } from "../../../../store/useMatchPostStore";
import { FiMapPin } from "react-icons/fi";
import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";
import { useNavigate } from "react-router-dom";

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
  return (
    <Card onClick={goMatchingInfo}>
      <Left>
        <TitleRow>
          <Title>{post.title}</Title>

          {post.category === "하루 도움" && (
            <OneDayBadge>하루 도움</OneDayBadge>
          )}
        </TitleRow>
        <User>{post.user}</User>

        <Row>
          <MapPinIcon size={16} />
          <Info>{post.location}</Info>
        </Row>

        <Row>
          <CalendarIcon size={16} />
          <Info>{post.date}</Info>
        </Row>

        <TagRow>
          {post.tags.map((tag) => (
            <HelpTag key={tag}>{tag}</HelpTag>
          ))}
        </TagRow>
      </Left>

      {post.image && (
        <Thumbnail>
          <img src={post.image} />
        </Thumbnail>
      )}

      <BottomBar>
        <BottomInner>
          <ChatButton>
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;

  padding-bottom: 16px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  background: ${({ theme }) => theme.color.white};
  margin-bottom: 8px;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
`;

const User = styled.div`
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  margin-top: 4px;
  margin-bottom: 8px;
`;

const Row = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  margin-bottom: 4px;
`;

const Info = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  font-weight: ${({ theme }) => theme.weight.regular};
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
// 아직 사진 있는 버전 구현 X
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
  display: flex;
  justify-content: center;
  padding: 4px 0 0;
`;

const BottomInner = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
`;

const ChatButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 0.5px solid ${({ theme }) => theme.color.natural200};
  background: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.regular};
  span {
    margin-left: 6px;
  }
`;

const DoneButton = styled.button`
  flex: 2;
  height: 40px;

  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.size.md};
  border: none;
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const ReviewButton = styled.button`
  flex: 2;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};
  border: none;
  font-weight: ${({ theme }) => theme.weight.regular};
  span {
    margin-left: 6px;
  }
`;
