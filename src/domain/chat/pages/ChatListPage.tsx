import { useEffect, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useChatHandler } from "../../../hooks/useChatHandler";
import { formatChatTime } from "../utils/date";
import { chatApi } from "../api/chatApi"; // API 임포트 추가

/* Components */
import Header from "../../../components/Header";
import Layout from "../../../components/Layout";
import NavBar from "../../../components/NavBar";
const ChatListPage = () => {
  // Store 상태 추출
  const { chatrooms, hasNext, nextChatroomId, setChatrooms } = useChatStore();
  const { handleChatOpen } = useChatHandler();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  // API 파라미터로 들어갈 내 아이디 (실제로는 로그인 정보에서 가져와야 합니다)
  const MY_ID = "100";
  const observerTarget = useRef<HTMLDivElement>(null);

  /**
   * API 호출 및 Store 저장 로직
   */
  const fetchList = useCallback(
    async (isMore = false) => {
      if (isLoading) return;

      // 더보기 모드인데 다음 커서(ID)가 없으면 중단
      if (isMore && !nextChatroomId) return;

      setIsLoading(true);
      try {
        // [API 보고 수정된 부분]
        // 인자 1: currentMemberId (MY_ID)
        // 인자 2: lastChatroomId (더보기면 스토어의 ID, 아니면 null)
        const response = await chatApi.getChatRoomList(
          MY_ID,
          isMore ? nextChatroomId : null
        );

        // Store에 응답 데이터 반영 (isMore에 따라 쌓거나 새로고침)
        setChatrooms(response, isMore);
      } catch (error) {
        console.error("채팅 목록을 불러오는 중 오류가 발생했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, nextChatroomId, setChatrooms, MY_ID]
  );

  // 1. 초기 렌더링 시 목록 로드
  useEffect(() => {
    fetchList(false);
  }, []); // 마운트 시 1회 실행

  // 2. 무한 스크롤 관찰
  useEffect(() => {
    if (!hasNext || isLoading || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchList(true);
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [hasNext, isLoading, fetchList]);

  return (
    <ChatContainer>
      <h2 className="sr-only">채팅 메시지 목록</h2>
      <Layout>
        <Header title="채팅" onBack={() => navigate("/")} />
        <ChatList>
          {chatrooms && chatrooms.length > 0
            ? chatrooms.map((room) => (
                <ChatItem
                  key={room.chatroomId}
                  onClick={() =>
                    handleChatOpen(MY_ID, {
                      chatroomId: room.chatroomId,
                    })
                  }
                >
                  <ProfileImage
                    src={room.otherProfileImageUrl || "/default-profile.png"}
                    alt={room.otherNickname}
                  />
                  <ChatInfo>
                    <ChatFirstRow>
                      <Nickname>{room.otherNickname}</Nickname>
                      <ChatLastTime>
                        {formatChatTime(room.updatedAt)}
                      </ChatLastTime>
                    </ChatFirstRow>
                    <PostTitle>{room.title}</PostTitle>
                  </ChatInfo>
                </ChatItem>
              ))
            : !isLoading && <EmptyState>진행 중인 채팅이 없습니다.</EmptyState>}

          {/* 하단 스크롤 감지 영역 */}
          {hasNext && (
            <ObserverTarget ref={observerTarget}>
              <LoadingText>목록을 더 불러오는 중...</LoadingText>
            </ObserverTarget>
          )}
        </ChatList>
      </Layout>
      <NavBar />
    </ChatContainer>
  );
};
export default ChatListPage;

// Styled Components
const ChatContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const ChatList = styled.div`
  overflow-y: auto;
  height: calc(100vh - 73px);
  padding-bottom: 70px;
`;

const ChatItem = styled.div`
  position: relative;
  height: 131px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  padding-top: 30px;
`;

const ProfileImage = styled.img`
  width: 15%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const ChatInfo = styled.div`
  margin-left: 15px;
  flex: 1;
`;
const ChatFirstRow = styled.div`
  display: flex;
  align-items: flex-start;
`;
const Nickname = styled.p`
  font-weight: ${({ theme }) => theme.weight.medium};
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  margin: 0;
`;

const ChatLastTime = styled.p`
  position: absolute;
  right: 0px;
  font-weight: ${({ theme }) => theme.weight.regular};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const PostTitle = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  margin: 2px 0 0 0;
`;
const ChatLastRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 8px;
`;
const LastMessage = styled.p`
  max-width: 80%;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.div`
  position: absolute;
  right: 0px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.main};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const EmptyState = styled.div``;
const ObserverTarget = styled.div`
  width: 100%;
  height: 50px; /* 감지 영역 높이 */
  display: flex;
  align-items: center; /* 수직 중앙 정렬 */
  justify-content: center; /* 수평 중앙 정렬 */
  margin: 10px 0; /* 위아래 여백 */
  background-color: transparent; /* 평소엔 투명하게 */
`;

const LoadingText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.color?.subText2 || "#999999"};
  font-weight: 500;

  /* 로딩 중임을 알리는 간단한 애니메이션 효과 (선택사항) */
  &::after {
    content: "...";
    display: inline-block;
    width: 12px;
    text-align: left;
    animation: dots 1.5s steps(4, end) infinite;
  }

  @keyframes dots {
    0%,
    20% {
      content: "";
    }
    40% {
      content: ".";
    }
    60% {
      content: "..";
    }
    80%,
    100% {
      content: "...";
    }
  }
`;
