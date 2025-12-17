import React, { useState, useRef, useEffect } from "react";
import styled, { css } from "styled-components";

import ChatRoomCard from "../components/ChatRoomCard";
//import { useMockChatStore } from "../../../store/useMockStore";
import { useSocketStore } from "../../../store/useSocketStore";
import Layout from "../../../components/Layout";
import { FaArrowCircleUp } from "react-icons/fa";
const ChatRoom = () => {
  // 1. 스토어에서 데이터와 추가 함수 가져오기
  //const { messages, addMessage } = useMockChatStore();
  const { messages, connect, disconnect, sendMessage, connected } =
    useSocketStore();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 테스트용 설정 (토큰 1 = 내 ID 1)
  const MY_MEMBER_ID = 1;
  const RECEIVER_ID = 2;

  // 1. 페이지 진입 시 소켓 연결
  useEffect(() => {
    connect();
    return () => disconnect(); // 나갈 때 연결 해제
  }, []);

  // 2. 메시지 추가 시 스크롤 하단 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 전송 핸들러
  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    console.log("handleSendMessage receiverId:", RECEIVER_ID);
    sendMessage(RECEIVER_ID, inputValue);
    setInputValue("");
  };
  console.log("메시지 목록:", messages);
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // UTC를 KST로 변환
  const convertKST = (utcString: string) => {
    const date = new Date(utcString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return kstDate;
  };
  //시간 포맷팅
  const formatTime = (kstDate: Date) => {
    return kstDate.toLocaleTimeString("ko-KR", {
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
          const isMe = msg.senderId === MY_MEMBER_ID;
          return (
            <MessageRow key={msg.id || index} $isMe={isMe}>
              {/* 내 메시지일 때 시간: 왼쪽 */}
              {isMe && (
                <MessageTime>
                  {formatTime(convertKST(msg.createdAt))}
                </MessageTime>
              )}

              <MessageBubble $isMe={isMe}>{msg.textContent}</MessageBubble>

              {/* 상대방 메시지일 때 시간: 오른쪽 */}
              {!isMe && (
                <MessageTime>
                  {formatTime(convertKST(msg.createdAt))}
                </MessageTime>
              )}
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
  padding: 20px 0;

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
function scrollToBottom() {
  throw new Error("Function not implemented.");
}
