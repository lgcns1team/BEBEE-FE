import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import Layout from "../../../components/Layout";
import ChatRoomCard from "../components/ChatRoomCard";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../../../store/useSocketStore";
import { chatApi } from "../api/chatApi";
import { FaArrowCircleUp } from "react-icons/fa";

const ChatRoom = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();

  // [ID 설정 분리]
  const API_MEMBER_ID = "100"; // 채팅룸/내역 API용 내 아이디
  const SOCKET_MEMBER_ID = "1"; // 소켓 구독/전송용 내 아이디
  const RECEIVER_ID = 2; // 소켓 전송용 상대방 아이디

  // 1. ChatStore (API 기반 과거 내역)
  const {
    setActiveRoom,
    historyMessages,
    fetchHistory,
    clearHistory,
    messageHasNext,
    nextChatId,
    isLoadingHistory,
  } = useChatStore();

  // 2. SocketStore (실시간 소켓 메시지)
  const {
    messages: socketMessages,
    connect,
    disconnect,
    sendMessage,
  } = useSocketStore();

  const [inputValue, setInputValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);

  /**
   * 3. 전체 메시지 통합
   */
  const allMessages = useMemo(() => {
    return [...historyMessages, ...socketMessages];
  }, [historyMessages, socketMessages]);

  /**
   * 4. 채팅방 초기화 (API 및 소켓 연결)
   */
  useEffect(() => {
    const initChatRoom = async () => {
      if (!chatroomId) return;

      try {
        // [수정] 채팅방 상세 정보 조회 시 '100'번 아이디 사용
        const roomInfo = await chatApi.openChatRoom(
          API_MEMBER_ID,
          undefined,
          chatroomId
        );
        setActiveRoom(roomInfo);

        // 과거 내역 가져오기
        await fetchHistory(chatroomId, null);

        // 소켓 연결 (SocketStore 내부적으로 '1'번으로 구독함)
        connect();
      } catch (error) {
        console.error("채팅방 초기화 실패:", error);
      }
    };

    initChatRoom();

    return () => {
      clearHistory();
      disconnect();
    };
  }, [
    chatroomId,
    connect,
    disconnect,
    fetchHistory,
    clearHistory,
    setActiveRoom,
  ]);

  /**
   * 5. 무한 스크롤 (과거 내역 로드)
   */
  const handleLoadMore = useCallback(async () => {
    if (messageHasNext && !isLoadingHistory && chatroomId && nextChatId) {
      if (scrollContainerRef.current) {
        prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
      }
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
    if (!inputValue.trim()) return;

    // 소켓 전송 시 상대방 ID '2' 사용
    sendMessage(RECEIVER_ID, inputValue);
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
          // [중요] '100'(API 내역) 또는 '1'(실시간 소켓)인 경우 모두 내가 보낸 것으로 처리
          const isMe =
            String(msg.senderId) === API_MEMBER_ID ||
            String(msg.senderId) === SOCKET_MEMBER_ID;

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
overflow-anchor: auto
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
