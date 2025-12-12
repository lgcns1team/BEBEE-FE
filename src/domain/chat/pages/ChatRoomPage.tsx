import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";

import ChatRoomCard from "../components/ChatRoomCard";
import { useMockChatStore } from "../../../store/useMockStore"; // 경로가 맞는지 꼭 확인하세요!
import Layout from "../../../components/Layout";
import { FaArrowCircleUp } from "react-icons/fa";
const ChatRoom = () => {
  // 1. 스토어에서 데이터와 추가 함수 가져오기
  const { messages, addMessage } = useMockChatStore();

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // 스크롤 바닥 감지

  // ★ 중요: 내 ID 설정 (스토어의 가짜 데이터와 맞춰야 함)
  const myMemberId = 1;

  // 2. 메시지가 추가될 때마다 스크롤을 맨 아래로 내림
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 3. 메시지 전송 로직
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // 가짜 메시지 객체 생성
    const newMessage = {
      id: Date.now(),
      senderId: myMemberId, // 내가 보낸 걸로 표시
      textContent: inputValue,
      createdAt: new Date().toISOString(),
      messageType: "TALK",
    };

    addMessage(newMessage); // 스토어 업데이트 (화면에 바로 반영됨)
    setInputValue(""); // 입력창 비우기
  };

  // 엔터키 전송 (한글 중복 입력 방지)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 시간 포맷팅 (예: 오후 2:30)
  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Layout>
      <ChatRoomCard />
      {/* 메시지 리스트 영역 */}
      <MessageList>
        {messages.map((msg, index) => {
          const isMe = msg.senderId === myMemberId;
          return (
            <MessageRow key={msg.id || index} $isMe={isMe}>
              {/* 내 메시지일 때 시간: 왼쪽 */}
              {isMe && <MessageTime>{formatTime(msg.createdAt)}</MessageTime>}

              <MessageBubble $isMe={isMe}>{msg.textContent}</MessageBubble>

              {/* 상대방 메시지일 때 시간: 오른쪽 */}
              {!isMe && <MessageTime>{formatTime(msg.createdAt)}</MessageTime>}
            </MessageRow>
          );
        })}
        {/* 스크롤 자동 이동을 위한 투명 div */}
        <div ref={messagesEndRef} />
      </MessageList>

      {/* 입력창 영역 */}
      <InputArea>
        <StyledInput
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
        />
        <SendButton onClick={handleSendMessage} disabled={!inputValue.trim()}>
          <FaArrowCircleUp size={20} color="#FFBE00" />
        </SendButton>
      </InputArea>
    </Layout>
  );
};

export default ChatRoom;

// --- 스타일 컴포넌트 (CSS) ---

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
  }
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
