import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import MessageItem from "./MessageItem";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../../../store/useUserStore";

const EMPTY_ARRAY: never[] = [];

const MessageList = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // 빈 배열 상수를 사용하여 매번 새로운 배열을 생성하지 않도록 함
  const rawMessages = useChatStore((state) => {
    if (!chatroomId) return EMPTY_ARRAY;
    const roomData = state.messagesByChatroom[chatroomId];
    return roomData?.messages || EMPTY_ARRAY;
  });

  // 메시지를 createdAt 기준으로 정렬
  // useMemo를 사용하여 정렬 결과를 캐싱하여 무한 루프 방지
  const messages = useMemo(() => {
    if (!rawMessages || rawMessages.length === 0) return EMPTY_ARRAY;

    const sorted = [...rawMessages].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    return sorted;
  }, [rawMessages]);
  const hasNext = useChatStore((state) =>
    chatroomId ? state.messagesByChatroom[chatroomId]?.hasNext ?? false : false
  );
  const fetchHistory = useChatStore((state) => state.fetchHistory);
  const { user } = useUserStore();
  const isLoadingMoreRef = useRef<boolean>(false);
  const shouldScrollToBottomRef = useRef<boolean>(true);
  const previousMessagesLengthRef = useRef<number>(0);

  const scrollToBottom = useCallback(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ block: "end", behavior: "auto" });
    } else if (scrollRef.current) {
      // 폴백
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    previousMessagesLengthRef.current = 0;
    shouldScrollToBottomRef.current = true;

    // 1. 즉시 실행 (다음 프레임)
    requestAnimationFrame(scrollToBottom);

    // 2. 약간의 지연 후 재실행 (안전 장치)
    const timer = setTimeout(scrollToBottom, 120);

    return () => clearTimeout(timer);
  }, [chatroomId, scrollToBottom]);
  // 스크롤을 맨 아래로 이동 (새 메시지 수신/전송 시)
  useEffect(() => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    // 메시지가 추가되었고, 사용자가 맨 아래에 있었거나 처음 로딩인 경우
    if (messages.length > previousMessagesLengthRef.current) {
      if (
        shouldScrollToBottomRef.current ||
        isNearBottom ||
        previousMessagesLengthRef.current === 0
      ) {
        requestAnimationFrame(() => {
          scrollToBottom();
          // 카드형 메시지(매칭확인서/성공 카드 등) 렌더 지연 대비 추가 호출
          requestAnimationFrame(scrollToBottom);
          setTimeout(scrollToBottom, 50);
        });
        shouldScrollToBottomRef.current = true;
      }
    }

    previousMessagesLengthRef.current = messages.length;
  }, [messages.length, scrollToBottom]);

  // 위로 스크롤할 때 이전 메시지 불러오기
  useEffect(() => {
    if (!chatroomId || !scrollRef.current) return;

    const container = scrollRef.current;
    const currentChatroomId = chatroomId;

    const handleScroll = () => {
      // 이미 로딩 중이면 무시
      if (isLoadingMoreRef.current) return;

      // chatroomId가 변경되었는지 확인
      if (currentChatroomId !== chatroomId) {
        return;
      }

      const isAtTop = container.scrollTop < 200;
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        100;

      // 조건부 업데이트: hasNext가 true일 때만 실행
      if (isAtTop && hasNext) {
        isLoadingMoreRef.current = true;
        shouldScrollToBottomRef.current = false;
        const previousScrollHeight = container.scrollHeight;

        fetchHistory(currentChatroomId, false)
          .then(() => {
            // chatroomId가 변경되었는지 다시 확인
            if (currentChatroomId !== chatroomId || !scrollRef.current) {
              isLoadingMoreRef.current = false;
              return;
            }

            // 스크롤 위치 유지 (위에 메시지가 추가되므로)
            requestAnimationFrame(() => {
              if (
                container &&
                scrollRef.current &&
                currentChatroomId === chatroomId
              ) {
                const newScrollHeight = container.scrollHeight;
                const scrollDiff = newScrollHeight - previousScrollHeight;
                container.scrollTop = scrollDiff;
              }
              isLoadingMoreRef.current = false;
            });
          })
          .catch(() => {
            isLoadingMoreRef.current = false;
          });
      } else if (isAtBottom) {
        // 사용자가 맨 아래로 스크롤했을 때
        shouldScrollToBottomRef.current = true;
      } else {
        // 사용자가 중간 어딘가에 있을 때
        shouldScrollToBottomRef.current = false;
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
      // cleanup 시 로딩 상태 초기화
      isLoadingMoreRef.current = false;
    };
  }, [chatroomId, hasNext, fetchHistory]);

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
      role="list"
      aria-label={`채팅 메시지 목록입니다. 총 ${messages.length}개의 메시지가 있습니다.`}
    >
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
              <DateDivider
                role="separator"
                aria-label={`날짜 구분선: ${getFormatDate(msg.createdAt)}`}
                aria-atomic="true"
              >
                <span aria-hidden="true">{getFormatDate(msg.createdAt)}</span>
                <span className="sr-only">
                  날짜 구분선: {getFormatDate(msg.createdAt)}부터의 메시지입니다
                </span>
              </DateDivider>
            )}

            <MessageItem message={msg} isMe={msg.senderId === user?.memberId} />
          </React.Fragment>
        );
      })}
      {messages.length === 0 && (
        <span className="sr-only" role="status" aria-live="polite">
          아직 메시지가 없습니다.
        </span>
      )}
      <BottomSpacer />
      <div ref={bottomRef} />
    </ListContainer>
  );
};

export default MessageList;

const SPACER_HEIGHT = "calc(80px + env(safe-area-inset-bottom, 0px))";

const ListContainer = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: ${({ theme }) => theme.color.white};
  padding-top: 20px;
  padding-bottom: 12px;

  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
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

const BottomSpacer = styled.div`
  height: ${SPACER_HEIGHT};
  flex-shrink: 0;
`;
