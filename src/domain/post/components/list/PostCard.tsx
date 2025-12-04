import styled from "styled-components";
import type { Post } from "../../../../store/usePostStore";
import { MdOutlinePlace } from "react-icons/md";
import { MdOutlineCalendarToday } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import HelpTag from "../../../../components/HelpTag";

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
          <PlaceIcon size={16} />
          <InfoText>{post.location}</InfoText>
        </InfoLine>

        <InfoLine>
          <CalendarIcon size={16} />
          <InfoText>{post.date}</InfoText>
        </InfoLine>

        <TagWrapper>
          <HelpTag>이동지원</HelpTag>
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
  padding: 16px 0px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  background: ${({ theme }) => theme.color.white};
  margin-bottom: 8px;
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
  font-size: ${({ theme }) => theme.size.sm};
  background: ${({ theme }) => theme.color.subColor2};
  padding: 4px 8px;
  border: 0.5px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.color.text};
`;

const HoneyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
`;

const DoneBadge = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  padding: 3px 7px;
  color: ${({ theme }) => theme.color.red500};
  border: 0.5px solid ${({ theme }) => theme.color.red500};
  background-color: ${({ theme }) => theme.color.red50};
  border-radius: 1px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  line-height: 1.3;
`;

const Honey = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const PlaceIcon = styled(MdOutlinePlace)`
  color: ${({ theme }) => theme.color.subText2};
`;

const CalendarIcon = styled(MdOutlineCalendarToday)`
  color: ${({ theme }) => theme.color.subText2};
`;

const InfoLine = styled.div`
  display: flex;
  gap: 9px;
  align-items: center;
  margin-bottom: 4px;
`;

const InfoText = styled.span`
  font-weight: ${({ theme }) => theme.weight.regular};
  color: ${({ theme }) => theme.color.subText2};
  font-size: ${({ theme }) => theme.size.sm};
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;

const Thumbnail = styled.div`
  width: 90px;
  height: 90px;

  img {
    width: 100%;
    height: 100%;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    object-fit: cover;
  }
`;
