import { useEffect, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useChatHandler } from "../../../hooks/useChatHandler";
import { formatChatTime } from "../utils/date";
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

  const observerTarget = useRef<HTMLDivElement>(null);

  /**
   * API 호출 및 Store 저장 로직
   */
  const fetchList = useCallback(
    async (isMore = false) => {
      // 이미 로딩 중이면 중복 요청 방지
      if (isLoading) {
        console.log("이미 로딩 중, 요청 스킵");
        return;
      }

      // 추가 로드 시 nextChatroomId가 없으면 요청하지 않음
      if (isMore && !nextChatroomId) {
        console.log(" nextChatroomId가 없어 추가 로드 불가");
        return;
      }

      setIsLoading(true);
      try {
        console.log("📡 [fetchList] 채팅방 목록 조회:", {
          isMore,
          lastChatroomId: isMore ? nextChatroomId : null,
        });

        const response = await chatApi.getChatRoomList(
          isMore ? nextChatroomId : null
        );

        console.log("채팅방 목록 조회 성공:", {
          count: response.chatrooms?.length || 0,
          hasNext: response.hasNext,
          nextChatroomId: response.nextChatroomId,
        });

        // Store에 응답 데이터 반영 (isMore에 따라 쌓거나 새로고침)
        setChatrooms(response, isMore);
      } catch (error) {
        console.error(" 채팅 목록을 불러오는 중 오류:", error);
        // 에러 발생 시 사용자에게 알림 (선택사항)
        // alert("채팅 목록을 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    },
    [nextChatroomId, setChatrooms] // isLoading 제거 (무한 루프 방지)
  );

  // 1. 초기 렌더링 시 목록 로드 (마운트 시 1회만 실행)
  useEffect(() => {
    fetchList(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 빈 배열로 마운트 시 1회만 실행

  // 2. 무한 스크롤 관찰
  useEffect(() => {
    // 조건 확인: 더 불러올 데이터가 있고, 로딩 중이 아니고, 관찰 대상이 있어야 함
    if (!hasNext || isLoading || !observerTarget.current) {
      console.log({
        hasNext,
        isLoading,
        hasObserverTarget: !!observerTarget.current,
      });
      return;
    }

    console.log("👀 [IntersectionObserver] 관찰 시작");

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("📜 [IntersectionObserver] 스크롤 감지, 추가 로드 시작");
          fetchList(true);
        }
      },
      { threshold: 0.1 } // 10%만 보여도 트리거 (1.0은 너무 높음)
    );

    observer.observe(observerTarget.current);
    return () => {
      console.log("🧹 [IntersectionObserver] 관찰 해제");
      observer.disconnect();
    };
  }, [hasNext, isLoading, fetchList]);

  return (
    <ChatContainer role="main" aria-label="채팅 목록">
      <h2 className="sr-only">채팅 메시지 목록</h2>
      <Layout>
        <Header title="채팅" onBack={() => navigate("/")} />
        <ChatList role="list" aria-label="채팅방 목록">
          {chatrooms && chatrooms.length > 0
            ? chatrooms.map((room) => (
              <ChatItem
                key={room.chatroomId}
                role="listitem"
                onClick={() => {
                  console.log("채팅방 클릭:", {
                    chatroomId: room.chatroomId,
                    room,
                  });
                  handleChatOpen({
                    chatroomId: room.chatroomId,
                  });
                }}
                aria-label={`${room.otherNickname}님과의 채팅방, ${room.title
                  }, 마지막 메시지: ${room.lastMessage || "없음"}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleChatOpen({
                      chatroomId: room.chatroomId,
                    });
                  }
                }}
              >
                <ProfileImage
                  src={room.otherProfileImageUrl}
                  alt={`${room.otherNickname}님의 프로필 사진`}
                />
                <ChatInfo>
                  <ChatFirstRow>
                    <Nickname>{room.otherNickname}</Nickname>
                    <ChatLastTime
                      aria-label={`마지막 메시지 시간: ${formatChatTime(
                        room.updatedAt
                      )}`}
                    >
                      {formatChatTime(room.updatedAt)}
                    </ChatLastTime>
                  </ChatFirstRow>
                  <PostTitle>
                    {room.title}
                    <span className="sr-only">게시글 제목</span>
                  </PostTitle>
                  <PostTitle>
                    {room.lastMessage || "메시지 없음"}
                    <span className="sr-only">마지막 메시지</span>
                  </PostTitle>
                </ChatInfo>
              </ChatItem>
            ))
            : !isLoading && (
              <EmptyState role="status" aria-live="polite">
                진행 중인 채팅이 없습니다.
              </EmptyState>
            )}

          {/* 하단 스크롤 감지 영역 */}
          {hasNext && (
            <ObserverTarget
              ref={observerTarget}
              className="sr-only"
              aria-label="더 불러오기 영역"
            >
              <LoadingText role="status" aria-live="polite">
                목록을 더 불러오는 중...
              </LoadingText>
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
