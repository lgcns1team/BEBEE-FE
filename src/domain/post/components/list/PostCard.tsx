import styled from "styled-components";
import type { Post } from "../../../../store/usePostStore";
import { MdOutlinePlace } from "react-icons/md";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Props {
  post: Post;
}

const PostCard = ({ post }: Props) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/post/${post.id}`)}>
      <Content>
        <TopArea>
          <Title>{post.title}</Title>
          <RightTop>
            {post.category === "하루 도움" && (
              <Category>{post.category}</Category>
            )}
          </RightTop>
        </TopArea>

        <HoneyRow>
          {post.done && <DoneBadge>매칭 완료</DoneBadge>}
          <Honey>{post.honey} 꿀</Honey>
        </HoneyRow>

        <InfoLine>
          <MdOutlinePlace size={16} color="#777" />
          <InfoText>{post.location}</InfoText>
        </InfoLine>

        <InfoLine>
          <MdOutlineCalendarToday size={16} color="#777" />
          <InfoText>{post.date}</InfoText>
        </InfoLine>

        <TagWrapper>
          {post.tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </TagWrapper>
      </Content>

      {post.image && (
        <Thumbnail>
          <img src={post.image} alt="thumbnail" />
        </Thumbnail>
      )}
    </Card>
  );
};

export default PostCard;

const Card = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 0.5px solid var(--natural-100);
  background: white;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TopArea = styled.div`
  display: flex;
  justify-content: space-between;
`;

const RightTop = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
`;

const Category = styled.div`
  font-size: 12px;
  background: var(--sub-color2);
  padding: 4px 8px;
  border: 1px solid var(--main-color);
  border-radius: 8px;
  color: var(--text);
`;

const HoneyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const DoneBadge = styled.div`
  font-size: 9px;
  padding: 3px 7px;
  color: var(--error-red);
  border: 1px solid var(--error-red);
  background-color: #fef2f2;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
`;

const Honey = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const InfoLine = styled.div`
  display: flex;
  gap: 9px;
  align-items: center;
`;

const InfoText = styled.span`
  font-weight: 400;
  color: var(--sub-text2);
  font-size: 12px;
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

const Tag = styled.div`
  font-size: 12px;
  padding: 4px 8px;
  background: var(--natural-100);
  color: var(--text);
  border-radius: 5px;
`;

const Thumbnail = styled.div`
  width: 90px;
  height: 90px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }
`;
