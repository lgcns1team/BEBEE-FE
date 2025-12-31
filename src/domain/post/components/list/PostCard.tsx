import styled from "styled-components";
import type { PostItem } from "../../../../types/post.type";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";
import DoneBadge from "../../../../components/DoneBadge";

interface PostCardProps {
  post: PostItem;
}

// 요일 변환용 맵
const DAY_MAP: Record<string, string> = {
  MONDAY: "월",
  TUESDAY: "화",
  WEDNESDAY: "수",
  THURSDAY: "목",
  FRIDAY: "금",
  SATURDAY: "토",
  SUNDAY: "일",
};

const PostCard = ({ post }: PostCardProps) => {
  const isDay = post.helpType === "DAY";

  // 날짜/요일 포맷팅 로직
  const getScheduleText = () => {
    if (isDay && post.date) {
      // DAY: "11월 30일 (화)" 형식
      const dateObj = new Date(post.date);
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const dayName = DAY_MAP[post.dayOfWeeks[0]] || "";
      return `${month}월 ${day}일 (${dayName})`;
    }
    // TERM: "월요일, 수요일, 목요일" 형식
    return post.dayOfWeeks.map((d) => `${DAY_MAP[d]}요일`).join(", ");
  };

  return (
    <Card>
      <Content>
        <TopArea>
          <Title>{post.title}</Title>
          <RightTop>
            {/* 정기 도움일 경우 다른 배지를 쓰거나 비워둘 수 있습니다 */}
            {isDay && <OneDayBadge>하루 도움</OneDayBadge>}
          </RightTop>
        </TopArea>

        <BottomArea>
          <BottomLeft>
            <HoneyRow>
              {/* DAY 타입이면서 매칭 완료 상태일 때만 배지 노출 */}
              {isDay && post.isMatched && <DoneBadge>매칭 완료</DoneBadge>}
              <Honey>
                {post.unitHoney.toLocaleString()} 꿀
                {/* TERM 타입일 경우 회당/총액 정보 추가 노출 */}
                {!isDay && (
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: "normal",
                      color: "#8E8E8E",
                      marginLeft: "4px",
                    }}
                  >
                    /회 (총 {post.totalHoney.toLocaleString()} 꿀)
                  </span>
                )}
              </Honey>
            </HoneyRow>

            <InfoLine>
              <MapPinIcon size={16} />
              {/* 지역명에서 동네 이름만 추출 (예: '장충동') */}
              <InfoText>{post.legalDongName.split(" ").pop()}</InfoText>
            </InfoLine>

            <InfoLine>
              <CalendarIcon size={16} />
              <InfoText>{getScheduleText()}</InfoText>
            </InfoLine>

            <TagWrapper>
              {post.helpCategories.map((cat, index) => (
                <HelpTag key={index}>{cat}</HelpTag>
              ))}
            </TagWrapper>
          </BottomLeft>

          {post.imageUrl && (
            <BottomRight>
              <Thumbnail>
                <img src={post.imageUrl} alt={post.title} />
              </Thumbnail>
            </BottomRight>
          )}
        </BottomArea>
      </Content>
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

const BottomArea = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
`;

const BottomLeft = styled.div`
  flex: 1;
`;

const BottomRight = styled.div`
  flex-shrink: 0;
`;
