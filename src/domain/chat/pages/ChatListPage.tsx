import { useEffect, useCallback, useRef, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { useChatHandler } from "../../../hooks/useChatHandler";
import { formatChatTime } from "../utils/date";
import { chatApi } from "../../../api/chatApi";
import type { ChatroomListItem } from "../types/chat.types";
import defaultProfileImage from "../../../assets/images/bee-santa.png";

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
  const [newRoomMap, setNewRoomMap] = useState<Record<string, boolean>>({});

  const observerTarget = useRef<HTMLDivElement>(null);
  const prevChatroomsRef = useRef<ChatroomListItem[]>([]);
  const hasInitializedListRef = useRef(false);

  useEffect(() => {
    prevChatroomsRef.current = chatrooms;
  }, [chatrooms]);

  const markRoomAsRead = useCallback((chatroomId: string) => {
    setNewRoomMap((prev) => {
      if (!prev[chatroomId]) return prev;
      const next = { ...prev };
      delete next[chatroomId];
      return next;
    });
  }, []);

  const openRoom = useCallback(
    (chatroomId: string) => {
      markRoomAsRead(chatroomId);
      handleChatOpen({ chatroomId });
    },
    [handleChatOpen, markRoomAsRead]
  );

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
        console.log(" 채팅방 목록 조회:", {
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

        // 새로고침(isMore=false)일 때만: 이전 목록 대비 새로 온/업데이트된 채팅방 표시
        if (!isMore) {
          const prev = prevChatroomsRef.current;

          // 첫 진입 초기 로딩에서는 전체가 "새로움"으로 표시되지 않도록 스킵
          if (hasInitializedListRef.current && prev.length > 0) {
            const prevMap = new Map(
              prev.map((r) => [r.chatroomId, r.updatedAt])
            );
            const nextNew: Record<string, boolean> = {};

            for (const room of response.chatrooms || []) {
              const prevUpdatedAt = prevMap.get(room.chatroomId);
              if (!prevUpdatedAt) {
                nextNew[room.chatroomId] = true; // 새 채팅방
              } else if (
                room.updatedAt &&
                prevUpdatedAt &&
                room.updatedAt !== prevUpdatedAt
              ) {
                nextNew[room.chatroomId] = true; // 기존 방의 업데이트
              }
            }

            // 기존에 남아있던 표시도 유지 + 새 표시를 병합
            setNewRoomMap((prevMarks) => ({ ...prevMarks, ...nextNew }));
          }

          hasInitializedListRef.current = true;
        }

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
    [isLoading, nextChatroomId, setChatrooms]
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
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          console.log("추가 로드 시작");
          fetchList(true);
        }
      },
      { threshold: 0.1 } // 10%만 보여도 트리거 (1.0은 너무 높음)
    );

    observer.observe(observerTarget.current);
    return () => {
      observer.disconnect();
    };
  }, [hasNext, isLoading, fetchList]);

  const getChatRoomDescription = (room: ChatroomListItem) => {
    const nickname = room.otherNickname;
    const title = room.title;
    const lastMsg = room.lastMessage || "메시지 없음";
    const time = formatChatTime(room.updatedAt);

    // 핵심 정보 위주로 구성 (순서: 누구와? -> 어떤 글에서? -> 마지막 내용 -> 시간)
    return `${nickname}님과의 채팅. 게시글 제목은 ${title}. 마지막 메시지는 ${lastMsg}. ${time}`;
  };

  return (
    <ChatContainer role="main" aria-label="채팅 목록">
      <h2 className="sr-only">채팅 메시지 목록</h2>
      <Layout>
        <Header title="채팅" onBack={() => navigate("/home")} />
        {/* 스크린리더용 로딩 안내(탭 이동 시 "목록을 더 불러오는 중..." 반복 낭독 방지) */}
        <div
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {isLoading && hasNext ? "채팅 목록을 더 불러오는 중입니다." : ""}
        </div>

        <ChatList role="list" aria-busy={isLoading}>
          {Array.isArray(chatrooms) && chatrooms.length > 0
            ? chatrooms.map((room, index) => (
                <ChatItem
                  key={room.chatroomId}
                  role="listitem"
                  tabIndex={0}
                  onClick={() => {
                    openRoom(room.chatroomId);
                  }}
                  aria-label={getChatRoomDescription(room)}
                  aria-posinset={index + 1}
                  aria-setsize={chatrooms.length}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openRoom(room.chatroomId);
                    }
                  }}
                >
                  <ProfileImage
                    src={room.otherProfileImageUrl || defaultProfileImage}
                    alt=""
                    aria-hidden="true"
                  />
                  <ChatInfo aria-hidden="true">
                    <ChatFirstRow>
                      <Nickname>{room.otherNickname}</Nickname>
                      <ChatLastTime>
                        {formatChatTime(room.updatedAt)}
                        {newRoomMap[room.chatroomId] && (
                          <NewDot aria-hidden="true" />
                        )}
                      </ChatLastTime>
                    </ChatFirstRow>
                    <PostTitle>{room.title}</PostTitle>
                    <PostTitle style={{ marginTop: "6px" }}>
                      {room.lastMessage || "메시지 없음"}
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
              aria-hidden="true"
            />
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
  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(100vh - 73px);
  padding-bottom: 70px;
`;

const ChatItem = styled.div`
  position: relative;
  height: fit-content;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 20px 0;
`;

const ProfileImage = styled.img`
  width: 12%;
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
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NewDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: ${({ theme }) => theme.color.red500};
  flex-shrink: 0;
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
