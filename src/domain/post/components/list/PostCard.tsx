import styled from "styled-components";
import type { PostItem } from "../../../../types/post.type";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";
import DoneBadge from "../../../../components/DoneBadge";
import { HELP_TAG_MAP } from "../../../../constants/helpTags";
import { getScheduleText } from "../../../../types/common.types";

interface PostCardProps {
  post: PostItem;
}

const PostCard = ({ post }: PostCardProps) => {
  const isDay = post.helpType === "DAY";

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
              {/*매칭 완료 상태일 때만 배지 노출 */}
              {post.isMatched && <DoneBadge>매칭 완료</DoneBadge>}
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
              <InfoText>
                {getScheduleText(post.helpType, post.date, post.dayOfWeeks)}
              </InfoText>
            </InfoLine>

            <InfoLine>
              {post.helpCategories.map((cat) => (
                <HelpTag key={cat}>{HELP_TAG_MAP[cat]}</HelpTag>
              ))}
            </InfoLine>
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
  margin-bottom: 10px;
`;

const InfoText = styled.span`
  font-weight: ${({ theme }) => theme.weight.regular};
  color: ${({ theme }) => theme.color.subText2};
  font-size: ${({ theme }) => theme.size.sm};
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
