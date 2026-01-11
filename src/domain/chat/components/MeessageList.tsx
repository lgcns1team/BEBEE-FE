import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import MessageItem from "./MessageItem";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../../../store/useUserStore";

const MessageList = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messages = useChatStore((state) => state.getMessages());
  const { user } = useUserStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 날짜 포맷 함수 (YYYY-MM-DD)
  const getFormatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  return (
    <ListContainer
      ref={scrollRef}
      role="log"
      aria-label="채팅 메시지 목록"
      aria-live="polite"
      aria-atomic="false"
    >
      <span className="sr-only">
        채팅 메시지 목록입니다. 총 {messages.length}개의 메시지가 있습니다.
      </span>
      {messages.map((msg, index) => {
        // 이전 메시지와 날짜 비교
        const prevMsg = messages[index - 1];
        const isNewDay =
          !prevMsg ||
          new Date(prevMsg.createdAt).toDateString() !==
            new Date(msg.createdAt).toDateString();

        return (
          <React.Fragment key={msg.id}>
            {/* 날짜가 바뀌었을 때만 구분선 표시 */}
            {isNewDay && (
              <DateDivider role="separator" aria-label={`날짜 구분선: ${getFormatDate(msg.createdAt)}`}>
                <span>{getFormatDate(msg.createdAt)}</span>
                <span className="sr-only">
                  {getFormatDate(msg.createdAt)}부터의 메시지입니다
                </span>
              </DateDivider>
            )}

            <MessageItem message={msg} isMe={msg.senderId === user?.memberId} />
          </React.Fragment>
        );
      })}
    </ListContainer>
  );
};

export default MessageList;

// --- Styles ---

const ListContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #f9f9f9;
`;

const DateDivider = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #eee;
  }

  span {
    padding: 0 12px;
    font-size: 12px;
    color: #999;
    background-color: transparent;
  }
`;
