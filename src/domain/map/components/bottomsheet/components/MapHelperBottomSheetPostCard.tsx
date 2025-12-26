import React from "react";
import styled from "styled-components";
import type { Post } from "../../../../../store/usePostStore";
import HelpTag from "../../../../../components/HelpTag";
import { FiCalendar } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import OneDayBadge from "../../../../../components/OneDayBadge";

interface Props {
  post: Post;
}

const MapHelperBottomSheetPostCard = ({ post }: Props) => {
  return (
    <Card>
      <Content>
        <TopArea>
          <Title>{post.title}</Title>
          <RightTop>
            {post.category === "하루 도움" && (
              <OneDayBadge>{post.category}</OneDayBadge>
            )}
          </RightTop>
        </TopArea>

        <InfoLine>
          <MapPinIcon size={16} />
          <InfoText>{post.location}</InfoText>
        </InfoLine>

        <InfoLine>
          <CalendarIcon size={16} />
          <InfoText>{post.dates}</InfoText>
        </InfoLine>

        <TagWrapper>
          {post.tags.map((tag) => (
            <HelpTag key={tag}>{tag}</HelpTag>
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
