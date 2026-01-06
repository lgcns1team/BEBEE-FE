import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import Layout from "../../../components/Layout";
import ChatRoomCard from "../components/ChatRoomCard";
import MatchResultCard from "../components/MatchResultCard";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../../../store/useSocketStore";
import { chatApi } from "../api/chatApi";
import { FaArrowCircleUp } from "react-icons/fa";

const ChatRoom = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();

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
  const RECEIVER_ID = 2; // 소켓 전송용 상대방 아이디

  // 1. ChatStore (API 기반 과거 내역)
  const {
    setActiveRoom,
    fetchHistory,
    isLoadingHistory,
    getHistoryMessages,
    getMessageHasNext,
    getNextChatId,
    messagesByChatroom, // messagesByChatroom 변경 감지를 위해 구독
  } = useChatStore();

  // 현재 채팅방의 메시지 조회 (chatroomId나 messagesByChatroom이 변경될 때마다 재계산)
  const historyMessages = useMemo(() => {
    if (!chatroomId) return [];
    return getHistoryMessages(chatroomId);
  }, [chatroomId, getHistoryMessages, messagesByChatroom]);

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

  /**
   * 3. 전체 메시지 통합
   *
   * API로 가져온 과거 메시지(historyMessages)와
   * 소켓으로 받은 실시간 메시지(socketMessages)를 합칩니다.
   *
   * 메시지 순서: [과거 메시지들 (오래된 것 → 최신 것)] + [실시간 메시지들]
   *
   * 주의: 소켓 메시지가 API 메시지와 중복될 수 있으므로,
   * 실제 운영 환경에서는 중복 제거 로직이 필요할 수 있습니다.
   */
  const allMessages = useMemo(() => {
    return [...historyMessages, ...socketMessages];
  }, [historyMessages, socketMessages]);

  /**
   * API 메시지 콘솔 출력 (항상 출력)
   */
  useEffect(() => {
    console.log("📨 [ChatRoomPage] API 메시지 상태:", {
      개수: historyMessages.length,
      메시지: historyMessages,
      isEmpty: historyMessages.length === 0,
    });
  }, [historyMessages]);

  /**
   * 실시간 소켓 메시지 콘솔 출력 (항상 출력)
   */
  useEffect(() => {
    console.log("⚡ [ChatRoomPage] 실시간 소켓 메시지 상태:", {
      개수: socketMessages.length,
      메시지: socketMessages,
      isEmpty: socketMessages.length === 0,
    });
    if (socketMessages.length > 0) {
      const latestMessage = socketMessages[socketMessages.length - 1];
      console.log("🆕 [ChatRoomPage] 최신 실시간 메시지:", latestMessage);
    }
  }, [socketMessages]);

  /**
   * 전체 메시지 통합 결과 콘솔 출력 (항상 출력)
   */
  useEffect(() => {
    console.log("💬 [ChatRoomPage] 전체 메시지 통합 상태:", {
      총개수: allMessages.length,
      API메시지개수: historyMessages.length,
      실시간메시지개수: socketMessages.length,
      통합메시지목록: allMessages,
      isEmpty: allMessages.length === 0,
    });
  }, [allMessages, historyMessages.length, socketMessages.length]);

  /**
   * 4. 채팅방 초기화 (API 및 소켓 연결)
   */
  useEffect(() => {
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
        // 같은 채팅방이고 메시지가 이미 있으면 다시 로드하지 않음 (메시지 유지)
        const existingMessages = currentState.getHistoryMessages(chatroomId);
        if (!isSameChatroom || existingMessages.length === 0) {
          console.log(" 과거 메시지 조회 중...");
          await fetchHistory(chatroomId, null);
        } else {
          console.log(
            "기존 메시지 유지 (재로드 스킵), 메시지 개수:",
            existingMessages.length
          );
        }

        // 주의: 소켓 메시지도 채팅방별로 관리되므로 초기화하지 않음
        // 모든 메시지(매칭확인서, 채팅, 내용)가 나갔다 들어와도 유지됨

        // 채팅방 정보 업데이트 (메시지 로드 후)
        setActiveRoom(roomInfo);

        // 소켓 연결 (SocketStore 내부적으로 '1'번으로 구독함)
        console.log(" 소켓 연결 중...");
        connect();
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
      disconnect();

      // 주의: 메시지를 초기화하지 않음
      // 매칭확인서, 채팅, 내용 모두 나갔다 들어와도 유지됨
      // 각 채팅방의 메시지는 독립적으로 관리됨
    };
  }, [chatroomId, connect, disconnect, fetchHistory, setActiveRoom]);

  /**
   * 5. 무한 스크롤 (과거 내역 로드)
   *
   * 스웨거 명세에 따르면:
   * - 응답의 nextChatId를 다음 요청의 lastChatId로 전달
   * - hasNext가 true이면 더 불러올 메시지가 있음
   */
  const handleLoadMore = useCallback(async () => {
    if (messageHasNext && !isLoadingHistory && chatroomId && nextChatId) {
      // 스크롤 위치 유지를 위해 현재 스크롤 높이 저장
      if (scrollContainerRef.current) {
        prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
      }
      // nextChatId를 lastChatId로 사용하여 이전 메시지 조회
      await fetchHistory(chatroomId, nextChatId);
    }
  }, [messageHasNext, isLoadingHistory, chatroomId, nextChatId, fetchHistory]);

  /**
   * 6. 스크롤 위치 제어
   */
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    if (prevScrollHeight.current > 0) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    } else {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMessages]);

  /**
   * 7. 상단 스크롤 감지
   */
  useEffect(() => {
    if (!messageHasNext || isLoadingHistory) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleLoadMore();
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleLoadMore, messageHasNext, isLoadingHistory]);

  /**
   * 8. 메시지 전송
   */
  const onSend = () => {
    if (!inputValue.trim() || !chatroomId) return;

    console.log("📤 [onSend] 메시지 전송 시도:", {
      receiverId: RECEIVER_ID,
      text: inputValue,
      chatroomId,
    });

    // 소켓 전송 시 상대방 ID와 chatroomId 포함
    sendMessage(RECEIVER_ID, inputValue, chatroomId);
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
    <Layout>
      <ChatRoomCard />

      <MessageList ref={scrollContainerRef}>
        <div ref={observerTarget} style={{ height: "10px" }} />

        {isLoadingHistory && (
          <LoadingText>이전 대화 불러오는 중...</LoadingText>
        )}

        {allMessages.map((msg, idx) => {
          // MATCH_CONFIRMATION 타입 메시지는 MatchResultCard로 렌더링
          if (msg.type === "MATCH_CONFIRMATION") {
            return (
              <MessageWrapper key={msg.id || `msg-${idx}`}>
                <MatchResultCard message={msg} />
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
            <MessageRow key={msg.id || `msg-${idx}`} $isMe={isMe}>
              {isMe && <MessageTime>{formatTime(msg.createdAt)}</MessageTime>}
              <MessageBubble $isMe={isMe}>{msg.textContent}</MessageBubble>
              {!isMe && <MessageTime>{formatTime(msg.createdAt)}</MessageTime>}
            </MessageRow>
          );
        })}

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
    </Layout>
  );
};

export default ChatRoom;

// --- 스타일 컴포넌트 (CSS) ---

const MessageList = styled.div`
  flex: 1;
  flex-direction: column;
  overflow-y: auto;
  padding: 20px 0;
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
