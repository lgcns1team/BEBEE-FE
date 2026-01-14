import styled, { css } from "styled-components";
import type { ChatMessage } from "../types/chat.types";
import MatchResult from "./MatchResultCard";
import MatchSuccess from "./MatchSuccessCard";
import MatchFail from "./MatchFailCard";

interface Props {
  message: ChatMessage;
  isMe: boolean;
}

const MessageItem = ({ message, isMe }: Props) => {
  // 시간 포맷팅 (예: 14:05)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // 1. 매칭 관련 카드 메시지인 경우 (가로 전체 사용)
  if (message.type === "MATCH_CONFIRMATION") {
    return (
      <MessageWrapper
        role="group"
        aria-label={`매칭 확인서 메시지, 전송 시간: ${formatTime(message.createdAt)}`}
      >
        <MatchResult data={message} />
        <span className="sr-only">
          전송 시간: {formatTime(message.createdAt)}
        </span>
      </MessageWrapper>
    );
  }

  if (message.type === "MATCH_SUCCESS") {
    return (
      <MessageWrapper
        role="group"
        aria-label={`매칭 성공 메시지, 전송 시간: ${formatTime(message.createdAt)}`}
      >
        <MatchSuccess message={message} />
        <span className="sr-only">
          전송 시간: {formatTime(message.createdAt)}
        </span>
      </MessageWrapper>
    );
  }

  if (message.type === "MATCH_FAILURE") {
    return (
      <MessageWrapper
        role="group"
        aria-label={`매칭 실패 메시지, 전송 시간: ${formatTime(message.createdAt)}`}
      >
        <MatchFail />
        <span className="sr-only">
          전송 시간: {formatTime(message.createdAt)}
        </span>
      </MessageWrapper>
    );
  }

  // 2. 일반 텍스트 메시지인 경우 (말풍선 사용)
  const messageLabel = isMe
    ? `내가 보낸 메시지: ${message.textContent || "내용 없음"}, 전송 시간: ${formatTime(message.createdAt)}`
    : `상대방이 보낸 메시지: ${message.textContent || "내용 없음"}, 수신 시간: ${formatTime(message.createdAt)}`;

  return (
    <MessageRow
      $isMe={isMe}
      role="listitem"
      aria-label={messageLabel}
    >
      {isMe && (
        <MessageTime aria-hidden="true">
          {formatTime(message.createdAt)}
        </MessageTime>
      )}
      <MessageBubble $isMe={isMe} aria-hidden="true">
        {message.textContent}
      </MessageBubble>
      {!isMe && (
        <MessageTime aria-hidden="true">
          {formatTime(message.createdAt)}
        </MessageTime>
      )}
      <span className="sr-only">{messageLabel}</span>
    </MessageRow>
  );
};

export default MessageItem;

// --- 제공해주신 스타일 컴포넌트 적용 ---
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
  background-color: ${({ $isMe, theme }) =>
    $isMe ? theme.color.main : theme.color.natural100};
  color: ${({ $isMe, theme }) =>
    $isMe ? theme.color.white : theme.color?.text};
  border-radius: 15px;
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
