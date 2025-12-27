import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import ChatRoomCard from "../components/ChatRoomCard";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../../../store/useSocketStore";
import Layout from "../../../components/Layout";
import { FaArrowCircleUp } from "react-icons/fa";

const ChatRoom = () => {
  const { id: chatroomId } = useParams<{ id: string }>();
  const {
    historyMessages,
    fetchHistory,
    clearHistory,
    messageHasNext,
    nextChatId,
    isLoadingHistory,
  } = useChatStore();
  const {
    messages: liveMessages,
    connect,
    disconnect,
    sendMessage,
  } = useSocketStore();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null); // 최상단 스크롤 감지용

  // 1. 메시지 통합 (이 부분을 렌더링에 사용해야 함)
  const allMessages = [...historyMessages, ...liveMessages];

  const MY_MEMBER_ID = 1;
  const RECEIVER_ID = 2;

  // 소켓 연결
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // 초기 데이터 로드
  useEffect(() => {
    if (chatroomId) fetchHistory(Number(chatroomId));
    return () => clearHistory();
  }, [chatroomId, fetchHistory, clearHistory]);

  // [중요] 2. 역방향 무한 스크롤 구현
  const handleLoadMore = useCallback(() => {
    if (messageHasNext && !isLoadingHistory && chatroomId) {
      // 이전 메시지를 불러올 때 스크롤 위치를 유지하는 로직이 브라우저에서 자동으로 작동하도록
      // scroll-anchor 처리가 필요할 수 있습니다.
      fetchHistory(Number(chatroomId), nextChatId);
    }
  }, [messageHasNext, isLoadingHistory, chatroomId, nextChatId, fetchHistory]);

  useEffect(() => {
    if (!messageHasNext || isLoadingHistory) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleLoadMore, messageHasNext, isLoadingHistory]);

  // 새 메시지 수신 시 하단 이동
  useEffect(() => {
    if (liveMessages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [liveMessages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    sendMessage(RECEIVER_ID, inputValue);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const convertKST = (utcString: string) => {
    const date = new Date(utcString);
    return new Date(date.getTime() + 9 * 60 * 60 * 1000);
  };

  const formatTime = (kstDate: Date) => {
    return kstDate.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <ChatRoomCard />
      <MessageList>
        {/* 상단 감지 포인트: 스크롤이 여기까지 올라오면 loadMore 실행 */}
        <div ref={observerTarget} style={{ height: "10px" }} />

        {isLoadingHistory && (
          <LoadingText>이전 대화 불러오는 중...</LoadingText>
        )}

        {/* [수정] messages -> allMessages로 변경 */}
        {allMessages.map((msg, index) => {
          const isMe = msg.senderId === MY_MEMBER_ID;
          return (
            <MessageRow key={msg.messageId || `temp-${index}`} $isMe={isMe}>
              {isMe && (
                <MessageTime>
                  {formatTime(convertKST(msg.createdAt))}
                </MessageTime>
              )}
              <MessageBubble $isMe={isMe}>{msg.content}</MessageBubble>
              {!isMe && (
                <MessageTime>
                  {formatTime(convertKST(msg.createdAt))}
                </MessageTime>
              )}
            </MessageRow>
          );
        })}
        <div ref={messagesEndRef} />
      </MessageList>

      <InputArea>
        <StyledInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton onClick={handleSendMessage} disabled={!inputValue.trim()}>
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
function scrollToBottom() {
  throw new Error("Function not implemented.");
}
