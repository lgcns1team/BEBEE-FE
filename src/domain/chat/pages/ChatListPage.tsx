import { useEffect, useCallback, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { chatApi } from "../api/chatApi";
import { useChatStore } from "../store/useChatStore";
import { useChatHandler } from "../../../hooks/useChatHandler";
import { formatChatTime } from "../utils/date";
/* Components */
import Header from "../../../components/Header";
import Layout from "../../../components/Layout";
import NavBar from "../../../components/NavBar";

const ChatListPage = () => {
  const { chatrooms, hasNext, nextChatroomId, setChatrooms } = useChatStore();
  const { handleChatOpen } = useChatHandler();
  const navigate = useNavigate();
  // 로딩 상태 관리 (선택 사항)

  const MY_ID = 100; // 실제로는 로그인한 유저 ID 사용

  const observerTarget = useRef<HTMLDivElement>(null);

  // 데이터 불러오기 함수 (useCallback으로 감싸서 무한 루프 방지)
  const fetchList = useCallback(
    async (isMore = false) => {
      try {
        // 더 불러오기일 때는 nextChatroomId 사용, 처음일 때는 undefined
        const lastId = isMore ? nextChatroomId : undefined;
        const data = await chatApi.getChatRoomList(MY_ID, lastId);

        setChatrooms(data, isMore);
        console.log(data);
      } catch (error) {
        console.error("채팅 목록 로드 실패:", error);
      }
    },
    [nextChatroomId, setChatrooms]
  );

  // 1. 초기 로드
  useEffect(() => {
    fetchList(false);
  }, []);

  // 2. 무한 스크롤 관찰자(Observer) 설정
  useEffect(() => {
    // 불러올 데이터가 없으면 관찰 중단
    if (!hasNext || !observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 타겟 요소가 화면에 들어오면(isIntersecting) 다음 데이터 호출
        if (entries[0].isIntersecting) {
          fetchList(true);
        }
      },
      { threshold: 1.0 } // 요소가 100% 다 보였을 때 실행
    );

    observer.observe(observerTarget.current);

    // 클린업: 컴포넌트 언마운트 시 관찰 중단
    return () => observer.disconnect();
  }, [hasNext, fetchList]);
  return (
    <ChatContainer>
      <Layout>
        <Header title="채팅" onBack={() => navigate("/")} />
        <ChatList>
          {chatrooms?.length > 0 ? (
            chatrooms.map((room) => (
              <ChatItem
                key={room.chatroomId}
                onClick={() =>
                  handleChatOpen(MY_ID, {
                    chatroomId: "791458418405204700",
                  })
                }
              >
                <ProfileImage
                  src={room.otherProfileImageUrl}
                  alt={room.otherNickname}
                />
                <ChatInfo>
                  <ChatFirstRow>
                    <Nickname>{room.otherNickname}</Nickname>
                    {/* updatedAt 오타 수정 */}
                    <ChatLastTime>
                      {formatChatTime(room.updatedAt)}
                    </ChatLastTime>
                  </ChatFirstRow>

                  <PostTitle>{room.title}</PostTitle>
                  {/*
                  <ChatLastRow>
                    <LastMessage>{chat.lastMessage}</LastMessage>
                    {chat.unreadCount > 0 && (
                      <UnreadBadge>{chat.unreadCount}</UnreadBadge>
                    )}
                  </ChatLastRow>*/}
                </ChatInfo>
              </ChatItem>
            )) // map 종료
          ) : (
            // 데이터가 없을 때의 처리가 필요합니다 (삼항 연산자 : 부분)
            <EmptyState>진행 중인 채팅이 없습니다.</EmptyState>
          )}
          {/* 무한 스크롤 타겟: 이 요소가 보이면 다음 페이지를 불러옵니다 */}
          {hasNext && (
            <ObserverTarget ref={observerTarget}>
              <LoadingText>목록을 불러오는 중...</LoadingText>
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
