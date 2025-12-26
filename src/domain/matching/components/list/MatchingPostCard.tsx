import styled from "styled-components";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { BsPencil, BsChat } from "react-icons/bs";
import type { Post } from "../../../../store/usePostStore";
import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import NoticeMessage from "../common/NoticeMessage";
import { useUserStore } from "../../../../store/useUserStore";

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

const MatchingPostCard = ({ post }: Props) => {
  const navigate = useNavigate();
  const [showNotice, setShowNotice] = useState(false);
  const [isIncomplete, setIsIncomplete] = useState(false);
  const { getUserByMemberId } = useUserStore();

  const author = getUserByMemberId(post.memberId);
  const goReview = () => navigate("/review");
  const goMatchingInfo = () => navigate(`/match-info/${post.postId}`);
  const handleMarkIncomplete = () => {
    setShowNotice(true);
  };

  const handleConfirmIncomplete = () => {
    setShowNotice(false);
    setIsIncomplete(true);
  };

  return (
    <>
      <Card>
        {/* ---------- Top ---------- */}
        <TopArea>
          <Title onClick={goMatchingInfo}>{post.title}</Title>
          {post.type === "하루 도움" && <OneDayBadge>하루 도움</OneDayBadge>}
        </TopArea>

        {/* ---------- Bottom ---------- */}
        <BottomArea>
          {/* 왼쪽 정보 */}
          <BottomLeft>
            <User>{author?.name}</User>

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

            <TagRow>
              {post.categoryName.map((category) => (
                <HelpTag key={category}>{category}</HelpTag>
              ))}
            </TagRow>
          </BottomLeft>

          {/* 오른쪽 이미지 */}
          {post.imageUrl && (
            <BottomRight>
              <Thumbnail>
                <img src={post.imageUrl} alt="thumbnail" />
              </Thumbnail>
            </BottomRight>
          )}
        </BottomArea>

        {/* ---------- Buttons ---------- */}
        <BottomBar>
          <BottomInner>
            <ChatButton>
              <BsChat size={12} />
              <span>채팅하기</span>
            </ChatButton>

            {post.status ? (
              <ReviewButton onClick={goReview}>
                <BsPencil size={12} />
                <span>리뷰 보내기</span>
              </ReviewButton>
            ) : (
              <DoneButton
                disabled={isIncomplete}
                $inactive={isIncomplete}
                onClick={handleMarkIncomplete}
              >
                활동 미완료
              </DoneButton>
            )}
          </BottomInner>
        </BottomBar>
      </Card>
      {showNotice && (
        <NoticeMessage
          onCancel={() => setShowNotice(false)}
          onConfirm={handleConfirmIncomplete}
        />
      )}
    </>
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

const DoneButton = styled.button<{ $inactive?: boolean }>`
  flex: 2;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ $inactive, theme }) =>
    $inactive ? theme.color.natural200 : theme.color.main};
  color: ${({ $inactive, theme }) =>
    $inactive ? theme.color.subText3 : theme.color.white};
  border: none;
  span {
    margin-left: 4px;
  }
`;

const ReviewButton = styled(DoneButton)`
  background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
`;
