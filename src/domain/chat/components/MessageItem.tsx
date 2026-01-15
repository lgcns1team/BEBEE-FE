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
  // 스크린리더용 시간 포맷 (예: 오전04시05분, 오후01시30분) - KST 고정
  const formatTimeForSr = (dateString: string) => {
    const formatter = new Intl.DateTimeFormat("ko-KR", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: "Asia/Seoul",
    });
    const parts = formatter.formatToParts(new Date(dateString));
    const hour = parts.find((p) => p.type === "hour")?.value ?? "";
    const minute = parts.find((p) => p.type === "minute")?.value ?? "";
    const period = parts.find((p) => p.type === "dayPeriod")?.value ?? "";
    const hh = hour.padStart(2, "0");
    const mm = minute.padStart(2, "0");
    return `${period}${hh}시${mm}분`;
  };

  // 화면 표시용 시간 포맷팅 (예: 14:05) - KST 고정
  const formatTimeDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Seoul",
    });
  };

  // 1. 매칭 관련 카드 메시지인 경우 (가로 전체 사용)
  if (message.type === "MATCH_CONFIRMATION") {
    return (
      <MessageWrapper
        role="group"
        tabIndex={0}
        aria-label={`${formatTimeForSr(message.createdAt)} 매칭 확인서 메시지`}
      >
        <MatchResult data={message} />
      </MessageWrapper>
    );
  }

  if (message.type === "MATCH_SUCCESS") {
    return (
      <MessageWrapper
        role="group"
        tabIndex={0}
        aria-label={`${formatTimeForSr(message.createdAt)} 매칭 성공 메시지`}
      >
        <MatchSuccess message={message} />
      </MessageWrapper>
    );
  }

  if (message.type === "MATCH_FAILURE") {
    return (
      <MessageWrapper
        role="group"
        tabIndex={0}
        aria-label={`${formatTimeForSr(message.createdAt)} 매칭 실패 메시지`}
      >
        <MatchFail />
      </MessageWrapper>
    );
  }

  // 2. 일반 텍스트 메시지인 경우 (말풍선 사용)
  const text = (message.textContent || "").trim() || "내용 없음";
  const messageLabel = isMe
    ? `내가보낸메세지 ${formatTimeForSr(message.createdAt)} ${text}`
    : `상대방메세지 ${formatTimeForSr(message.createdAt)} ${text}`;

  return (
    <MessageRow
      $isMe={isMe}
      role="listitem"
      tabIndex={0}
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
