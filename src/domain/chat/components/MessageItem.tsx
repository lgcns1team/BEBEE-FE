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
  // 시간 포맷팅 (예: 오전 4시 40분, 오후 1시 30분)
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${period} ${displayHours}시 ${minutes}분`;
  };

  // 화면 표시용 시간 포맷팅 (예: 14:05)
  const formatTimeDisplay = (dateString: string) => {
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
        aria-label={`${formatTime(message.createdAt)} 매칭 확인서 메시지`}
      >
        <MatchResult data={message} />
        <span className="sr-only">
          {formatTime(message.createdAt)} 매칭 확인서 메시지
        </span>
      </MessageWrapper>
    );
  }

  if (message.type === "MATCH_SUCCESS") {
    return (
      <MessageWrapper
        role="group"
        aria-label={`${formatTime(message.createdAt)} 매칭 성공 메시지`}
      >
        <MatchSuccess message={message} />
        <span className="sr-only">
          {formatTime(message.createdAt)} 매칭 성공 메시지
        </span>
      </MessageWrapper>
    );
  }

  if (message.type === "MATCH_FAILURE") {
    return (
      <MessageWrapper
        role="group"
        aria-label={`${formatTime(message.createdAt)} 매칭 실패 메시지`}
      >
        <MatchFail />
        <span className="sr-only">
          {formatTime(message.createdAt)} 매칭 실패 메시지
        </span>
      </MessageWrapper>
    );
  }

  // 2. 일반 텍스트 메시지인 경우 (말풍선 사용)
  const messageLabel = isMe
    ? `${formatTime(message.createdAt)} 내가 보낸 메시지 "${message.textContent || "내용 없음"}"`
    : `${formatTime(message.createdAt)} 상대방이 보낸 메시지 "${message.textContent || "내용 없음"}"`;

  return (
    <MessageRow
      $isMe={isMe}
      role="listitem"
      aria-label={messageLabel}
    >
      {isMe && (
        <MessageTime aria-hidden="true">
          {formatTimeDisplay(message.createdAt)}
        </MessageTime>
      )}
      <MessageBubble $isMe={isMe} aria-hidden="true">
        {message.textContent}
      </MessageBubble>
      {!isMe && (
        <MessageTime aria-hidden="true">
          {formatTimeDisplay(message.createdAt)}
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
