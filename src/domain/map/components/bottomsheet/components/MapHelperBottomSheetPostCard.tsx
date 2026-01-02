import styled from "styled-components";
import type { PostItem } from "../../../../../types/post.type";
import HelpTag from "../../../../../components/HelpTag";
import { FiCalendar } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import OneDayBadge from "../../../../../components/OneDayBadge";
import { useNavigate } from "react-router-dom";
import { HELP_TAG_MAP } from "../../../../../constants/helpTags";
interface Props {
  post: PostItem;
}

const MapHelperBottomSheetPostCard = ({ post }: Props) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/post/${post.postId}`)}>
      <Content>
        <TopArea>
          <Title>{post.title}</Title>
          <RightTop>
            {post.helpType === "DAY" && (
              <OneDayBadge>{post.helpType}</OneDayBadge>
            )}
          </RightTop>
        </TopArea>

        <InfoLine>
          <MapPinIcon size={16} />
          <InfoText>{post.legalDongName}</InfoText>
        </InfoLine>

        <InfoLine>
          <MapPinIcon size={16} />
          <InfoText>{post.legalDongName}</InfoText>
        </InfoLine>

        <InfoLine>
          <CalendarIcon size={16} />
          <InfoText>{post.date}</InfoText>
        </InfoLine>

        <TagWrapper>
          {post.helpCategories.map((cat) => (
            <HelpTag key={cat}>{HELP_TAG_MAP[cat] ?? "알 수 없음"}</HelpTag>
          ))}
        </TagWrapper>
      </Content>
    </Card>
  );
};

export default MapHelperBottomSheetPostCard;

const Card = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  padding-bottom: 16px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  background: ${({ theme }) => theme.color.white};
  margin-bottom: 18px;
  padding-left: 16px;
  padding-right: 16px;
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

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  line-height: 1.3;
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
