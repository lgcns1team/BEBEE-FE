import styled from "styled-components";
import type { Post } from "../../../../store/usePostStore";

import { FiCalendar } from "react-icons/fi";

import { FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";
import DoneBadge from "../../../../components/DoneBadge";
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
              <OneDayBadge>{post.category}</OneDayBadge>
            )}
          </RightTop>
        </TopArea>

        <HoneyRow>
          {post.done && <DoneBadge>매칭 완료</DoneBadge>}
          <Honey>{post.honey} 꿀</Honey>
        </HoneyRow>

        <InfoLine>
          <MapPinIcon size={16} />
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
  padding-top: 4px;
  padding-bottom: 16px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  background: ${({ theme }) => theme.color.white};
  margin-bottom: 18px;
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

const HoneyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  margin-bottom: 8px;
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

const MapPinIcon = styled(FiMapPin)`
  color: ${({ theme }) => theme.color.subText2};
`;

const CalendarIcon = styled(FiCalendar)`
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
