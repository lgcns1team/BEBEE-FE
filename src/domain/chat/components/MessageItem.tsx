import styled, { css } from "styled-components";
import type { ChatMessage } from "../types/chat.types";
import MatchResult from "./MatchResultCard"; // 매칭확인서
import MatchSuccess from "./MatchSuccessCard"; // 성공 카드
import MatchFail from "./MatchFailCard"; // 거절 카드

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
      <MessageWrapper>
        <MatchResult data={message} />
      </MessageWrapper>
    );
  }

  if (message.type === "MATCH_SUCCESS") {
    return (
      <MessageWrapper>
        <MatchSuccess />
      </MessageWrapper>
    );
  }

  if (message.type === "MATCH_FAILURE") {
    return (
      <MessageWrapper>
        <MatchFail />
      </MessageWrapper>
    );
  }

  // 2. 일반 텍스트 메시지인 경우 (말풍선 사용)
  return (
    <MessageRow
      $isMe={isMe}
      role="listitem"
      aria-label={isMe ? "내가 보낸 메시지" : "받은 메시지"}
    >
      {isMe && (
        <MessageTime aria-label={`전송 시간: ${formatTime(message.createdAt)}`}>
          {formatTime(message.createdAt)}
        </MessageTime>
      )}
      <MessageBubble $isMe={isMe}>
        {message.textContent}
        <span className="sr-only">
          {isMe ? "내가 보낸 메시지" : "상대방이 보낸 메시지"}, 전송 시간:{" "}
          {formatTime(message.createdAt)}
        </span>
      </MessageBubble>
      {!isMe && (
        <MessageTime aria-label={`수신 시간: ${formatTime(message.createdAt)}`}>
          {formatTime(message.createdAt)}
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
