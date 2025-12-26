import React from "react";
import styled from "styled-components";
import type { Post } from "../../../../../store/usePostStore";
import HelpTag from "../../../../../components/HelpTag";
import { FiCalendar } from "react-icons/fi";
import { FiMapPin } from "react-icons/fi";
import OneDayBadge from "../../../../../components/OneDayBadge";
import { useNavigate } from "react-router-dom";

interface Props {
  post: Post;
}

const DAY_KR_MAP: Record<
  "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
  string
> = {
  MON: "월요일",
  TUE: "화요일",
  WED: "수요일",
  THU: "목요일",
  FRI: "금요일",
  SAT: "토요일",
  SUN: "일요일",
};

const formatKoreanDate = (date?: Date) => {
  if (!date) return "";

  const d = new Date(date);
  const month = d.getMonth() + 1;
  const day = d.getDate();

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
  const dayOfWeek = dayNames[d.getDay()];

  return `${month}월 ${day}일 (${dayOfWeek})`;
};

const MapHelperBottomSheetPostCard = ({ post }: Props) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/post/${post.postId}`)}>
      <Content>
        <TopArea>
          <Title>{post.title}</Title>
          <RightTop>
            {post.type === "하루 도움" && (
              <OneDayBadge>{post.type}</OneDayBadge>
            )}
          </RightTop>
        </TopArea>

        <InfoLine>
          <MapPinIcon size={16} />
          <InfoText>{post.region}</InfoText>
        </InfoLine>

        <InfoLine>
          <CalendarIcon size={16} />

          {/* 하루 도움 */}
          {post.type === "하루 도움" && (
            <InfoText>{formatKoreanDate(post.engagementDate)}</InfoText>
          )}
          {/* 지속 도움 */}
          {post.type === "지속 도움" && (
            <InfoText>
              {post.dayOfWeek
                ?.map((schedule) => DAY_KR_MAP[schedule.dayOfWeek])
                .join(", ")}
            </InfoText>
          )}
        </InfoLine>

        <TagWrapper>
          {post.categoryName.map((category) => (
            <HelpTag key={category}>{category}</HelpTag>
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
