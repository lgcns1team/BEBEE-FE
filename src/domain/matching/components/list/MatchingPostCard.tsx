import styled from "styled-components";
import { FiCalendar, FiMapPin } from "react-icons/fi";
import { BsPencil, BsChat } from "react-icons/bs";
import type { Post } from "../../../../store/usePostStore";
import HelpTag from "../../../../components/HelpTag";
import OneDayBadge from "../../../../components/OneDayBadge";
import { useNavigate } from "react-router-dom";

import { useProfileStore } from "../../../../store/useProfileStore";
import { useChatHandler } from "../../../../hooks/useChatHandler";
import { useMatchStore } from "../../store/useMatchStore";

interface Props {
  post: Post;
}

const MatchingPostCard = ({ post }: Props) => {
  const navigate = useNavigate();

  const getAgreementByPostId = useMatchStore(
    (state) => state.getAgreementByPostId
  );
  const agreement = getAgreementByPostId(post.id);
  const engagementStatus = agreement?.help.engagementStatus;
  const { getUserByMemberId } = useProfileStore();
  const author = post.id ? getUserByMemberId(post.id) : undefined;

  const goMatchingInfo = () => {
    if (!agreement) return;
    navigate(`/match-info/${agreement.agreementId}`);
  };

  const goReviewPage = () => {
    navigate(`/review`);
  };

  const { handleChatOpen } = useChatHandler();

  return (
    <>
      <Card>
        <TopArea>
          <Title onClick={goMatchingInfo}>{post.title}</Title>
          {post.category === "하루 도움" && (
            <OneDayBadge>하루 도움</OneDayBadge>
          )}
        </TopArea>

        <BottomArea>
          {/* 왼쪽 정보 */}
          <BottomLeft>
            <User>{post.user}</User>

            <InfoLine>
              <MapPinIcon size={16} />
              <InfoText>{post.location}</InfoText>
            </InfoLine>

            <InfoLine>
              <CalendarIcon size={16} />
              {post.dates?.map((date) => (
                <InfoText key={date}>{date}</InfoText>
              ))}
            </InfoLine>

            <TagRow>
              {post.tags.map((tag) => (
                <HelpTag key={tag}>{tag}</HelpTag>
              ))}
            </TagRow>
          </BottomLeft>

          {/* 오른쪽 이미지 */}
          {post.image && (
            <BottomRight>
              <Thumbnail>
                <img src={post.image} alt="thumbnail" />
              </Thumbnail>
            </BottomRight>
          )}
        </BottomArea>

        <BottomBar>
          <BottomInner>
            <ChatButton
              onClick={() =>
                handleChatOpen(100, { chatroomId: agreement?.agreementId })
              }
            >
              <BsChat size={12} />
              <span>채팅하기</span>
            </ChatButton>

            {engagementStatus === "COMPLETED" ? (
              <DoneButton>
                <span>활동 완료</span>
              </DoneButton>
            ) : (
              <ReviewButton onClick={goReviewPage}>
                <BsPencil size={12} />
                <span>리뷰 작성하기</span>
              </ReviewButton>
            )}
          </BottomInner>
        </BottomBar>
      </Card>
    </>
  );
};

export default MatchingPostCard;
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
const BottomRight = styled.div`
  flex-shrink: 0;
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
