import React, { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import Layout from "../../../components/Layout";
import ChatRoomCard from "../components/ChatRoomCard";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../../../store/useSocketStore";
import { FaArrowCircleUp } from "react-icons/fa";

const ChatRoom = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const MY_MEMBER_ID = 1; // 실제 환경에선 auth 정보에서 가져옴
  const RECEIVER_ID = 2;

  const { messages, fetchMessages, clearHistory, messageHasNext, isLoading } =
    useChatStore();

  const { connect, disconnect, sendMessage } = useSocketStore();

  const [inputValue, setInputValue] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);

  // 1. 초기 데이터 및 소켓 연결
  useEffect(() => {
    if (chatroomId) {
      fetchMessages(chatroomId, true);
      connect();
    }
    return () => {
      clearHistory();
      disconnect();
    };
  }, [chatroomId]);

  // 2. 무한 스크롤(과거 데이터) 핸들러
  const handleLoadMore = useCallback(() => {
    if (messageHasNext && !isLoading && chatroomId) {
      if (scrollContainerRef.current) {
        prevScrollHeight.current = scrollContainerRef.current.scrollHeight;
      }
      fetchMessages(chatroomId);
    }
  }, [messageHasNext, isLoading, chatroomId, fetchMessages]);

  // 3. 스크롤 위치 제어 (보정 및 하단 이동)
  useEffect(() => {
    if (!scrollContainerRef.current) return;

    if (prevScrollHeight.current > 0) {
      // 과거 데이터 로딩 시: 스크롤 위치 유지
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = 0;
    } else {
      // 새 메시지 수신 시: 하단으로 이동
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 4. Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) handleLoadMore();
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const onSend = () => {
    if (!inputValue.trim()) return;
    sendMessage(RECEIVER_ID, inputValue);
    setInputValue("");
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <ChatRoomCard />
      <MessageList ref={scrollContainerRef}>
        {/* 상단 타겟: 여기에 닿으면 이전 메시지 로드 */}
        <div ref={observerTarget} style={{ height: "1px" }} />

        {isLoading && <LoadingText>이전 대화 불러오는 중...</LoadingText>}

        {messages.map((msg, idx) => {
          const isMe = msg.senderId === String(MY_MEMBER_ID);
          return (
            <MessageRow key={msg.id || idx} $isMe={isMe}>
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
          onKeyDown={(e) => e.key === "Enter" && onSend()}
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
