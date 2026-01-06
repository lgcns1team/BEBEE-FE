import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import ChatRoomCard from "../components/ChatRoomCard";
import MatchResultCard from "../components/MatchResultCard";
import MatchSuccessCard from "../components/MatchSuccessCard";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../../../store/useSocketStore";
import { chatApi } from "../api/chatApi";
import type { ChatMessage } from "../chat.types";
import { FaArrowCircleUp } from "react-icons/fa";

const ChatRoom = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();

  // 매칭 성공 정보 (로컬스토리지에서 복원)
  const [matchSuccessData, setMatchSuccessData] = useState<ChatMessage | null>(
    null
  );

  // chatroomId 확인 로그
  useEffect(() => {
    console.log("chatroomId from URL:", chatroomId);
    if (!chatroomId) {
      console.error("chatroomId가 없습니다");
    }
  }, [chatroomId]);

  // [ID 설정 분리] - 모두 number로 처리
  const API_MEMBER_ID = 100; // 채팅룸/내역 API용 내 아이디
  const SOCKET_MEMBER_ID = 1; // 소켓 구독/전송용 내 아이디

  // 1. ChatStore (API 기반 과거 내역)
  const {
    activeRoom,
    setActiveRoom,
    fetchHistory,
    isLoadingHistory,
    getHistoryMessages,
    getMessageHasNext,
    getNextChatId,
    getMessageWithMetadata,
    messagesByChatroom, // messagesByChatroom 변경 감지를 위해 구독
  } = useChatStore();

  // 현재 채팅방의 메시지 조회 (chatroomId나 messagesByChatroom이 변경될 때마다 재계산)
  const historyMessages = useMemo(() => {
    if (!chatroomId) return [];
    return getHistoryMessages(chatroomId).map((msg) =>
      getMessageWithMetadata(msg)
    );
  }, [
    chatroomId,
    getHistoryMessages,
    getMessageWithMetadata,
    messagesByChatroom,
  ]);

  const messageHasNext = useMemo(() => {
    if (!chatroomId) return false;
    return getMessageHasNext(chatroomId);
  }, [chatroomId, getMessageHasNext, messagesByChatroom]);

  const nextChatId = useMemo(() => {
    if (!chatroomId) return null;
    return getNextChatId(chatroomId);
  }, [chatroomId, getNextChatId, messagesByChatroom]);

  // 2. SocketStore (실시간 소켓 메시지)
  const {
    getMessages,
    connect,
    disconnect,
    sendMessage,
    messagesByChatroom: socketMessagesByChatroom, // 변경 감지를 위해 구독 (변수명 충돌 방지)
  } = useSocketStore();

  // 현재 채팅방의 소켓 메시지 조회
  const socketMessages = useMemo(() => {
    if (!chatroomId) return [];
    return getMessages(chatroomId);
  }, [chatroomId, getMessages, socketMessagesByChatroom]);

  const [inputValue, setInputValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);
  const isLoadingMoreRef = useRef<boolean>(false); // 중복 요청 방지용
  const prevMessagesLengthRef = useRef<number>(0); // 이전 메시지 개수 추적
  const isScrollingRef = useRef<boolean>(false); // 스크롤 중인지 추적
  const isInitialLoadRef = useRef<boolean>(true); // 초기 로드 여부

  /**
   * 3. 전체 메시지 통합
   *
   * API로 가져온 과거 메시지(historyMessages)와
   * 소켓으로 받은 실시간 메시지(socketMessages)를 합칩니다.
   *
   * 메시지 순서: [과거 메시지들 (오래된 것 → 최신 것)] + [실시간 메시지들]
   *
   * 중복 제거: 같은 id를 가진 메시지는 소켓 메시지가 우선됩니다.
   */
  const allMessages = useMemo(() => {
    // 소켓 메시지의 id Set 생성 (중복 체크용)
    const socketMessageIds = new Set(
      socketMessages.map((msg) => msg.id).filter(Boolean)
    );

    // historyMessages에서 소켓 메시지와 중복되지 않는 메시지만 필터링
    const uniqueHistoryMessages = historyMessages.filter(
      (msg) => !msg.id || !socketMessageIds.has(msg.id)
    );

    // 최종 중복 제거: 같은 id를 가진 메시지가 있으면 소켓 메시지가 우선
    const seenIds = new Map<string, ChatMessage>();

    // 먼저 historyMessages를 추가 (소켓 메시지와 중복되지 않는 것만)
    uniqueHistoryMessages.forEach((msg) => {
      if (msg.id && !socketMessageIds.has(msg.id)) {
        seenIds.set(msg.id, msg);
      } else if (!msg.id) {
        // id가 없는 메시지는 모두 포함
        seenIds.set(`no-id-${Math.random()}`, msg);
      }
    });

    // 그 다음 소켓 메시지를 추가 (같은 id가 있으면 덮어씀)
    socketMessages.forEach((msg) => {
      if (msg.id) {
        seenIds.set(msg.id, msg);
      } else {
        // id가 없는 소켓 메시지도 추가
        seenIds.set(`socket-no-id-${Math.random()}`, msg);
      }
    });

    // Map에서 배열로 변환하고 시간순 정렬
    const result = Array.from(seenIds.values());
    result.sort((a, b) => {
      const timeA = new Date(a.createdAt).getTime();
      const timeB = new Date(b.createdAt).getTime();
      return timeA - timeB;
    });

    return result;
  }, [historyMessages, socketMessages]);

  /**
   * API 메시지 콘솔 출력 (개발 환경에서만)
   */
  useEffect(() => {
    if (import.meta.env.DEV && historyMessages.length % 100 === 0) {
      // 100개 단위로만 로그 출력
      console.log("📨 [ChatRoomPage] API 메시지 상태:", {
        개수: historyMessages.length,
        isEmpty: historyMessages.length === 0,
      });
    }
  }, [historyMessages.length]);

  /**
   * 실시간 소켓 메시지 콘솔 출력 (개발 환경에서만, 소켓 메시지가 있을 때만)
   */
  useEffect(() => {
    if (import.meta.env.DEV && socketMessages.length > 0) {
      const latestMessage = socketMessages[socketMessages.length - 1];
      console.log("🆕 [ChatRoomPage] 최신 실시간 메시지:", latestMessage);
    }
  }, [socketMessages.length]);

  /**
   * 전체 메시지 통합 결과 콘솔 출력 (개발 환경에서만, 변경이 있을 때만)
   */
  useEffect(() => {
    if (import.meta.env.DEV) {
      const prevLength = prevMessagesLengthRef.current;
      if (allMessages.length !== prevLength) {
        console.log("💬 [ChatRoomPage] 전체 메시지 통합 상태:", {
          총개수: allMessages.length,
          API메시지개수: historyMessages.length,
          실시간메시지개수: socketMessages.length,
          isEmpty: allMessages.length === 0,
        });
      }
    }
  }, [allMessages.length, historyMessages.length, socketMessages.length]);

  /**
   * 3.5. 로컬스토리지에서 매칭 성공 정보 복원
   */
  useEffect(() => {
    if (!chatroomId) return;

    const storageKey = `bebee-match-success-${chatroomId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const successData = JSON.parse(stored) as ChatMessage;
        setMatchSuccessData(successData);
      } catch (error) {
        console.error("로컬스토리지에서 매칭 성공 정보 복원 실패:", error);
      }
    }
  }, [chatroomId]);

  /**
   * 매칭 수락 성공 콜백
   */
  const handleAcceptSuccess = useCallback((successData: ChatMessage) => {
    setMatchSuccessData(successData);
  }, []);

  /**
   * 4. 채팅방 초기화 (API 및 소켓 연결)
   */
  useEffect(() => {
    // 채팅방이 바뀔 때마다 초기 로드 플래그 리셋
    isInitialLoadRef.current = true;
    prevMessagesLengthRef.current = 0;

    const initChatRoom = async () => {
      if (!chatroomId) {
        console.log("chatroomId가 없습니다.");
        return;
      }

      try {
        // 채팅방 상세 정보 조회 (ChatRoomCard에서도 호출하지만, 여기서도 호출하여 스토어 동기화)
        const roomInfo = await chatApi.openChatRoom(undefined, chatroomId);
        console.log("채팅방 정보:", roomInfo);

        // 채팅방이 바뀌었는지 확인
        const currentState = useChatStore.getState();
        const isSameChatroom =
          currentState.activeRoom?.chatroomId === chatroomId;

        // 과거 내역 가져오기
        // localStorage에서 복원된 메시지가 있으면 먼저 확인
        const existingMessages = currentState.getHistoryMessages(chatroomId);

        // localStorage에 메시지가 있으면 서버와 동기화만 수행 (기존 메시지 유지)
        if (existingMessages.length > 0) {
          console.log(
            "✅ localStorage에서 메시지 복원됨, 서버와 동기화 중... 메시지 개수:",
            existingMessages.length
          );
          // 서버에서 최신 메시지만 가져와서 동기화 (기존 메시지는 유지)
          await useChatStore.getState().fetchHistory(chatroomId, null);
        } else {
          // localStorage에 메시지가 없으면 서버에서 처음부터 불러오기
          console.log(
            "📡 localStorage에 메시지 없음, 서버에서 처음부터 불러오기"
          );
          await useChatStore.getState().fetchHistory(chatroomId, null);
        }

        // 주의: 소켓 메시지도 채팅방별로 관리되므로 초기화하지 않음
        // 모든 메시지(매칭확인서, 채팅, 내용)가 나갔다 들어와도 유지됨

        // 채팅방 정보 업데이트 (메시지 로드 후)
        useChatStore.getState().setActiveRoom(roomInfo);

        // 소켓 연결 (SocketStore 내부적으로 '1'번으로 구독함)
        console.log(" 소켓 연결 중...");
        useSocketStore.getState().connect();
        console.log("채팅방 초기화 완료");
      } catch (error) {
        console.error("채팅방 초기화 실패:", error);
        // 에러 발생 시에도 메시지는 유지 (이미 로드된 메시지가 있으면 표시)
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { status?: number; statusText?: string; data?: unknown };
            message?: string;
          };
          console.error(" 에러 상세:", {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            message: axiosError.message,
          });
        }
      }
    };

    initChatRoom();

    return () => {
      // cleanup: 채팅방이 바뀔 때만 소켓 연결 해제
      // 메시지는 유지 (같은 채팅방으로 돌아올 때 메시지가 보이도록)
      console.log("cleanup:", chatroomId);

      // 소켓 연결만 해제 (메시지는 유지)
      useSocketStore.getState().disconnect();

      // 주의: 메시지를 초기화하지 않음
      // 매칭확인서, 채팅, 내용 모두 나갔다 들어와도 유지됨
      // 각 채팅방의 메시지는 독립적으로 관리됨
    };
  }, [chatroomId]); // 함수들을 dependency에서 제거하여 무한 루프 방지

  /**
   * 5. 무한 스크롤 (과거 내역 로드)
   *
   * 스웨거 명세에 따르면:
   * - 응답의 nextChatId를 다음 요청의 lastChatId로 전달
   * - hasNext가 true이면 더 불러올 메시지가 있음
   */
  const handleLoadMore = useCallback(async () => {
    // 중복 요청 방지: 이미 로딩 중이거나 더 불러올 메시지가 없으면 중단
    if (
      isLoadingMoreRef.current ||
      !messageHasNext ||
      isLoadingHistory ||
      !chatroomId ||
      !nextChatId
    ) {
      return;
    }

    // 로딩 시작
    isLoadingMoreRef.current = true;

    try {
      // 스크롤 위치 유지를 위해 현재 스크롤 높이 저장
      if (scrollContainerRef.current) {
        prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
      }
      // nextChatId를 lastChatId로 사용하여 이전 메시지 조회
      await useChatStore.getState().fetchHistory(chatroomId, nextChatId);
    } finally {
      // 로딩 완료 (성공/실패 관계없이)
      isLoadingMoreRef.current = false;
    }
  }, [messageHasNext, isLoadingHistory, chatroomId, nextChatId]);

  /**
   * 6. 스크롤 위치 제어
   */
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    const currentLength = allMessages.length;
    const prevLength = prevMessagesLengthRef.current;

    // 초기 로드 시: 메시지가 있고 첫 로드면 맨 아래로 스크롤
    if (isInitialLoadRef.current && currentLength > 0) {
      isInitialLoadRef.current = false;
      isScrollingRef.current = true;

      // 다음 프레임에서 스크롤 (DOM 렌더링 완료 후)
      setTimeout(() => {
        if (scrollContainerRef.current && messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "auto" });
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 100);
        }
      }, 0);

      prevMessagesLengthRef.current = currentLength;
      return;
    }

    // 이전 메시지를 불러올 때는 스크롤 위치 유지
    if (prevScrollHeight.current > 0) {
      const container = scrollContainerRef.current;
      const newScrollHeight = container.scrollHeight;
      const heightDiff = newScrollHeight - prevScrollHeight.current;

      // 스크롤 중 플래그 설정 (IntersectionObserver 트리거 방지)
      isScrollingRef.current = true;

      // 스크롤 위치 조정 (새로 추가된 메시지 높이만큼 위로 이동)
      container.scrollTop = container.scrollTop + heightDiff;
      prevScrollHeight.current = 0;

      // 스크롤 완료 후 플래그 해제
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    } else if (currentLength > prevLength && prevLength > 0) {
      // 새 메시지가 하단에 추가되었을 때만 맨 아래로 스크롤
      // (초기 로드가 아닐 때만)
      const container = scrollContainerRef.current;
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100; // 하단 100px 이내에 있으면

      if (isNearBottom) {
        isScrollingRef.current = true;
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 300);
      }
    }

    prevMessagesLengthRef.current = currentLength;
  }, [allMessages]);

  /**
   * 7. 상단 스크롤 감지
   */
  useEffect(() => {
    // 더 불러올 메시지가 없으면 observer 생성하지 않음
    if (!messageHasNext || !chatroomId) {
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 중복 실행 방지: 로딩 중이 아니고, 더 불러올 메시지가 있을 때만 실행
        // 스크롤 중일 때는 트리거하지 않음
        if (
          entry.isIntersecting &&
          !isLoadingMoreRef.current &&
          !isScrollingRef.current &&
          messageHasNext &&
          !isLoadingHistory &&
          chatroomId &&
          nextChatId
        ) {
          // debounce: 짧은 시간 내 여러 번 트리거되는 것 방지
          if (timeoutId) {
            clearTimeout(timeoutId);
          }

          timeoutId = setTimeout(() => {
            if (
              !isLoadingMoreRef.current &&
              !isScrollingRef.current &&
              messageHasNext &&
              !isLoadingHistory &&
              chatroomId &&
              nextChatId
            ) {
              handleLoadMore();
            }
          }, 200); // 200ms debounce
        }
      },
      { threshold: 0.1, rootMargin: "50px" } // rootMargin 추가로 조기 트리거 방지
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      observer.disconnect();
    };
  }, [
    handleLoadMore,
    messageHasNext,
    isLoadingHistory,
    chatroomId,
    nextChatId,
  ]);

  /**
   * 8. 메시지 전송
   */
  const onSend = () => {
    if (!inputValue.trim() || !chatroomId) return;

    // activeRoom에서 내 ID와 상대방 ID 가져오기
    if (!activeRoom?.myId || !activeRoom?.otherId) {
      console.error("⚠️ [onSend] activeRoom, myId 또는 otherId가 없습니다.");
      alert("채팅방 정보를 불러올 수 없습니다.");
      return;
    }

    const senderId = Number(activeRoom.myId);
    const receiverId = Number(activeRoom.otherId);

    console.log("📤 [onSend] 메시지 전송 시도:", {
      senderId,
      receiverId,
      text: inputValue,
      chatroomId,
      activeRoom,
    });

    // 소켓 전송 시 senderId, receiverId, chatroomId 포함
    sendMessage(senderId, receiverId, inputValue, chatroomId);
    setInputValue("");
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ChatRoomLayout>
      <ChatRoomCard />

      <MessageList ref={scrollContainerRef}>
        <div ref={observerTarget} style={{ height: "10px" }} />

        {isLoadingHistory && (
          <LoadingText>이전 대화 불러오는 중...</LoadingText>
        )}

        {allMessages.map((msg, idx) => {
          // 고유한 key 생성: id가 있으면 사용하고, 없으면 여러 속성을 조합하여 고유성 보장
          // idx를 포함하지 않도록 주의 (메시지 순서가 바뀌면 key가 바뀌어 문제 발생)
          const uniqueKey = msg.id
            ? `msg-${msg.id}`
            : `${msg.chatroomId || chatroomId}-${msg.type}-${msg.senderId}-${
                msg.createdAt
              }-${msg.textContent?.substring(0, 10) || ""}`;

          // MATCH_CONFIRMATION 타입 메시지는 MatchResultCard로 렌더링
          if (msg.type === "MATCH_CONFIRMATION") {
            return (
              <MessageWrapper key={uniqueKey}>
                <MatchResultCard
                  message={msg}
                  onAcceptSuccess={handleAcceptSuccess}
                />
              </MessageWrapper>
            );
          }

          // 일반 텍스트 메시지
          // [중요] senderId를 number로 변환하여 비교
          // API 내역(100) 또는 실시간 소켓(1)인 경우 모두 내가 보낸 것으로 처리
          const senderIdNum = Number(msg.senderId);
          const isMe =
            senderIdNum === API_MEMBER_ID || senderIdNum === SOCKET_MEMBER_ID;

          return (
            <MessageRow key={uniqueKey} $isMe={isMe}>
              {isMe && <MessageTime>{formatTime(msg.createdAt)}</MessageTime>}
              <MessageBubble $isMe={isMe}>{msg.textContent}</MessageBubble>
              {!isMe && <MessageTime>{formatTime(msg.createdAt)}</MessageTime>}
            </MessageRow>
          );
        })}

        {/* 매칭 성공 카드 (로컬스토리지에서 복원된 정보) */}
        {/* {matchSuccessData && (
          <MessageWrapper>
            <MatchSuccessCard message={matchSuccessData} />
          </MessageWrapper>
        )} */}

        <div ref={messagesEndRef} />
      </MessageList>

      <InputArea>
        <StyledInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              onSend();
            }
          }}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton onClick={onSend} disabled={!inputValue.trim()}>
          <FaArrowCircleUp size={30} color="#FFBE00" />
        </SendButton>
      </InputArea>
    </ChatRoomLayout>
  );
};

export default ChatRoom;

// --- 스타일 컴포넌트 (CSS) ---

const ChatRoomLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-height: 100vh;
  overflow: hidden;
  padding: 0 16px;
  box-sizing: border-box;
`;

const MessageList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 20px 0;
  min-height: 0; /* flex 컨테이너 내에서 스크롤 가능하도록 */
  overflow-anchor: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
`;
const LoadingText = styled.div`
  text-align: center;
  font-size: 12px;
  color: #999;
  padding: 10px;
`;
const MessageRow = styled.div<{ $isMe: boolean }>`
  display: flex;
  width: 100%;
  justify-content: ${({ $isMe }) => ($isMe ? "flex-end" : "flex-start")};
  margin-top: 16px;
  align-items: flex-end;
`;

const MessageBubble = styled.div<{ $isMe: boolean }>`
  max-width: 70%;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.5;

  // 테마 색상 적용 (없으면 기본값)
  background-color: ${({ $isMe, theme }) =>
    $isMe ? theme.color.main : theme.color.natural100};
  color: ${({ $isMe, theme }) =>
    $isMe ? theme.color.white : theme.color?.text};
  border-radius: 15px;

  // 말풍선 꼬리 효과
  ${({ $isMe }) =>
    $isMe
      ? css`
          border-top-right-radius: 0;
        `
      : css`
          border-top-left-radius: 0;
        `}
`;

const MessageTime = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.color.subText2};
  margin: 0 5px;
  min-width: fit-content;
`;

const MessageWrapper = styled.div`
  width: 100%;

  margin-top: 16px;
`;

const InputArea = styled.div`
  display: flex;
  padding: 16px 0;
  background-color: white;
  border-top: 1px solid #ebebeb;
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.color.natural100};
  background-color: ${({ theme }) => theme.color.natural100};
  font-size: 14px;
  outline: none;

  &:focus {
    background-color: #fff;
    border-color: #ccc;
  }
`;

const SendButton = styled.button`
  padding: 0 5px;
  border: none;
  background: none;
`;
