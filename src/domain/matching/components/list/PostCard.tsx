// src/components/PostCard.tsx
import styled from "styled-components";
import { MdOutlinePlace, MdOutlineCalendarToday } from "react-icons/md";
import { BsChat } from "react-icons/bs";
import type { Post } from "../../../../store/useMatchPostStore";

import HelpTag from "../../../../components/HelpTag";

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  return (
    <Card>
      <Left>
        <Title>{post.title}</Title>
        <User>{post.user}</User>

        <Row>
          <PlaceIcon size={16} />
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

      {post.category === "하루 도움" && (
        <CategoryBadge>하루 도움</CategoryBadge>
      )}

      <BottomBar>
        <BottomInner>
          <ChatButton>
            <BsChat size={12} />
            <span>채팅하기</span>
          </ChatButton>
          <DoneButton>활동 완료</DoneButton>
        </BottomInner>
      </BottomBar>
    </Card>
  );
};

export default PostCard;

/* ---------------- styled ---------------- */

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  background: white;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const User = styled.div`
  color: #555;
  font-size: 13px;
`;

const Row = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Info = styled.div`
  font-size: 13px;
  color: #777;
`;

const PlaceIcon = styled(MdOutlinePlace)`
  color: #777;
`;

const CalendarIcon = styled(MdOutlineCalendarToday)`
  color: #777;
`;

const TagRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Thumbnail = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CategoryBadge = styled.div`
  position: absolute;
  right: 0;
  top: 8px;
  background: #fff4d0;
  border: 1px solid #ffb800;
  color: #ffb800;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
`;

const BottomBar = styled.div`
  display: flex;
  justify-content: center;
  padding: 12px 0 0;
`;

const BottomInner = styled.div`
  width: 100%;
  display: flex;
  gap: 12px;
`;

const ChatButton = styled.button`
  flex: 1;
  height: 40px;
  border-radius: 8px;
  border: 0.5px solid #ddd;
  background: white;
  font-size: 14px;
  span {
    margin-left: 6px;
  }
`;

const DoneButton = styled.button`
  flex: 2;
  height: 40px;
  border-radius: 8px;
  background: #ffb800;
  color: white;
  font-size: 14px;
  border: none;
`;
