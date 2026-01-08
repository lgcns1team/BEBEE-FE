import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import styled, { css } from "styled-components";
import ChatRoomCard from "../components/ChatRoomCard";
import MatchResultCard from "../components/MatchResultCard";
import MatchFailCard from "../components/MatchFailCard";
import MatchSuccessCard from "../components/MatchSuccessCard";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../../../store/useSocketStore";
import { chatApi } from "../../../api/chatApi";
import type { ChatMessage } from "../chat.types";
import { FaArrowCircleUp } from "react-icons/fa";

const ChatRoom = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();

  // chatroomId 확인 로그
  useEffect(() => {
    console.log("chatroomId from URL:", chatroomId);
    if (!chatroomId) {
      console.error("chatroomId가 없습니다");
    }
  }, [chatroomId]);

  // 1. ChatStore (API 기반 과거 내역)
  const {
    activeRoom,
    setActiveRoom,
    isLoadingHistory,
    getHistoryMessages,
    getMessageHasNext,
    getNextChatId,
    getMessageWithMetadata,
    messagesByChatroom, // messagesByChatroom 변경 감지를 위해 구독
  } = useChatStore();

  // 현재 채팅방의 메시지 조회 (chatroomId나 messagesByChatroom이 변경될 때마다 재계산)
  const historyMessages = useMemo(() => {
    if (!chatroomId) return [];
    return getHistoryMessages(chatroomId).map((msg) =>
      getMessageWithMetadata(msg)
    );
  }, [
    chatroomId,
    getHistoryMessages,
    getMessageWithMetadata,
    messagesByChatroom,
  ]);

  const messageHasNext = useMemo(() => {
    if (!chatroomId) return false;
    return getMessageHasNext(chatroomId);
  }, [chatroomId, getMessageHasNext, messagesByChatroom]);

  const nextChatId = useMemo(() => {
    if (!chatroomId) return null;
    return getNextChatId(chatroomId);
  }, [chatroomId, getNextChatId, messagesByChatroom]);

  // 2. SocketStore (실시간 소켓 메시지)
  const {
    getMessages,

    sendMessage,
    messagesByChatroom: socketMessagesByChatroom, // 변경 감지를 위해 구독 (변수명 충돌 방지)
  } = useSocketStore();

  // 현재 채팅방의 소켓 메시지 조회
  const socketMessages = useMemo(() => {
    if (!chatroomId) return [];
    return getMessages(chatroomId);
  }, [chatroomId, getMessages, socketMessagesByChatroom]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const prevScrollHeight = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false); // 스크롤 중인지 추적
  const isInitialLoadRef = useRef<boolean>(true); // 초기 로드 여부
  const hasInitialized = useRef(false); // 초기화 여부 (HomePage 패턴)
  const prevMessagesLengthRef = useRef<number>(0); // 이전 메시지 개수 추적
  const initialLoadCompleteRef = useRef<boolean>(false); // 초기 로드 완료 여부

  /**
   * 3. 전체 메시지 통합
   *
   * API로 가져온 과거 메시지(historyMessages)와
   * 소켓으로 받은 실시간 메시지(socketMessages)를 합칩니다.
   *
   * 메시지 순서: [과거 메시지들 (오래된 것 → 최신 것)] + [실시간 메시지들]
   *
   * 중복 제거: 같은 id를 가진 메시지는 소켓 메시지가 우선됩니다.
   */
  const allMessages = useMemo(() => {
    // 안전한 배열 초기화
    const safeHistoryMessages = Array.isArray(historyMessages)
      ? historyMessages
      : [];
    const safeSocketMessages = Array.isArray(socketMessages)
      ? socketMessages
      : [];

    // 소켓 메시지의 id Set 생성 (중복 체크용)
    const socketMessageIds = new Set(
      safeSocketMessages.map((msg) => msg?.id).filter(Boolean)
    );

    // historyMessages에서 소켓 메시지와 중복되지 않는 메시지만 필터링
    const uniqueHistoryMessages = safeHistoryMessages.filter(
      (msg) => !msg?.id || !socketMessageIds.has(msg.id)
    );

    // 최종 중복 제거: 같은 id를 가진 메시지가 있으면 소켓 메시지가 우선
    const seenIds = new Map<string, ChatMessage>();

    // 먼저 historyMessages를 추가 (소켓 메시지와 중복되지 않는 것만)
    uniqueHistoryMessages.forEach((msg) => {
      if (msg.id && !socketMessageIds.has(msg.id)) {
        seenIds.set(msg.id, msg);
      } else if (!msg.id) {
        // id가 없는 메시지는 모두 포함 (고유 키 생성)
        const uniqueKey = `no-id-${msg.createdAt}-${msg.senderId}-${seenIds.size}`;
        seenIds.set(uniqueKey, msg);
      }
    });

    // 그 다음 소켓 메시지를 추가 (같은 id가 있으면 덮어씀)
    safeSocketMessages.forEach((msg) => {
      if (msg?.id) {
        seenIds.set(msg.id, msg);
      } else if (msg) {
        // id가 없는 소켓 메시지도 추가 (고유 키 생성)
        const uniqueKey = `socket-no-id-${msg.createdAt || "no-date"}-${
          msg.senderId || "unknown"
        }-${seenIds.size}`;
        seenIds.set(uniqueKey, msg);
      }
    });

    // Map에서 배열로 변환하고 시간순 정렬
    const result = Array.from(seenIds.values()).filter(Boolean);
    result.sort((a, b) => {
      const timeA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeA - timeB;
    });

    return result;
  }, [historyMessages, socketMessages]);

  /**
   * API 메시지 콘솔 출력 (개발 환경에서만)
   */
  useEffect(() => {
    if (import.meta.env.DEV && historyMessages.length % 100 === 0) {
      // 100개 단위로만 로그 출력
      console.log("API 메시지 상태:", {
        개수: historyMessages.length,
        isEmpty: historyMessages.length === 0,
      });
    }
  }, [historyMessages.length]);

  /**
   * 실시간 소켓 메시지 콘솔 출력 (개발 환경에서만, 소켓 메시지가 있을 때만)
   */
  useEffect(() => {
    if (import.meta.env.DEV && socketMessages.length > 0) {
      const latestMessage = socketMessages[socketMessages.length - 1];
      console.log("최신 실시간 메시지:", latestMessage);
    }
  }, [socketMessages.length]);

  /**
   * 전체 메시지 통합 결과 콘솔 출력 (개발 환경에서만, 변경이 있을 때만)
   */
  useEffect(() => {
    if (import.meta.env.DEV) {
      const prevLength = prevMessagesLengthRef.current;
      if (allMessages.length !== prevLength) {
        console.log("전체 메시지 통합 상태:", {
          총개수: allMessages.length,
          API메시지개수: historyMessages.length,
          실시간메시지개수: socketMessages.length,
          isEmpty: allMessages.length === 0,
        });
      }
    }
  }, [allMessages.length, historyMessages.length, socketMessages.length]);

  /**
   * 매칭 수락 성공 콜백
   */
  const handleAcceptSuccess = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (_successData: ChatMessage) => {
      // store에 이미 저장되어 있으므로 추가 작업 불필요
      if (chatroomId) {
        localStorage.removeItem(`bebee-match-fail-${chatroomId}`);
      }
    },
    [chatroomId]
  );

  /**
   * 매칭 거절 성공 콜백
   */
  const handleRefuseSuccess = useCallback(() => {
    // store에 이미 저장되어 있으므로 추가 작업 불필요
    setActiveRoom(
      activeRoom ? { ...activeRoom, matchStatus: "NON_MATCHED" } : activeRoom
    );
  }, [setActiveRoom, activeRoom]);

  /**
   * 4. 채팅방 초기화 (API 및 소켓 연결) - HomePage 패턴 적용
   */
  useEffect(() => {
    if (!chatroomId) {
      console.log("chatroomId가 없습니다.");
      return;
    }

    // 채팅방이 바뀔 때마다 초기화 플래그 리셋
    hasInitialized.current = false;
    isInitialLoadRef.current = true;
    initialLoadCompleteRef.current = false;

    const initChatRoom = async () => {
      // 이미 초기화했으면 다시 로드하지 않음 (HomePage 패턴)
      if (hasInitialized.current) {
        return;
      }

      // 로딩 중이면 대기
      const currentState = useChatStore.getState();
      if (currentState.isLoadingHistory) {
        console.log("이미 로딩 중입니다. 대기...");
        return;
      }

      hasInitialized.current = true;

      try {
        // 1. 채팅방 상세 정보 조회
        const roomInfo = await chatApi.openChatRoom(undefined, chatroomId);
        console.log("채팅방 정보:", roomInfo);

        // 2. 채팅방 정보 업데이트 (먼저 설정하여 다른 로직에서 사용 가능하도록)
        useChatStore.getState().setActiveRoom(roomInfo);

        // 3. 메시지 초기 로드 (항상 서버에서 최신 메시지 가져오기)
        // localStorage는 자동으로 복원되지만, 서버와 동기화는 항상 수행
        await useChatStore.getState().fetchHistory(chatroomId, null);

        // 4. 소켓 연결
        console.log("소켓 연결 중...");
        useSocketStore.getState().connect();
        console.log("채팅방 초기화 완료");
      } catch (error) {
        console.error("채팅방 초기화 실패:", error);
        hasInitialized.current = false; // 실패 시 다시 시도할 수 있도록
        if (error && typeof error === "object" && "response" in error) {
          const axiosError = error as {
            response?: { status?: number; statusText?: string; data?: unknown };
            message?: string;
          };
          console.error("에러 상세:", {
            status: axiosError.response?.status,
            statusText: axiosError.response?.statusText,
            data: axiosError.response?.data,
            message: axiosError.message,
          });
        }
      }
    };

    initChatRoom();

    return () => {
      // cleanup: 채팅방이 바뀔 때만 소켓 연결 해제
      console.log("cleanup:", chatroomId);
      useSocketStore.getState().disconnect();
      // 메시지는 유지 (같은 채팅방으로 돌아올 때 메시지가 보이도록)
    };
  }, [chatroomId]); // isLoadingHistory를 dependency에서 제거하여 무한 반복 방지

  /**
   * 5. 무한 스크롤 (과거 내역 로드) - HomePage 패턴 적용
   */
  const handleLoadMore = useCallback(async () => {
    // 더 가져올 데이터가 없거나 이미 로딩 중이면 종료 (HomePage 패턴)
    if (isLoadingHistory || !messageHasNext || !chatroomId || !nextChatId) {
      return;
    }

    try {
      // 스크롤 위치 유지를 위해 현재 스크롤 높이 저장
      const container = observerTarget.current?.parentElement;
      if (container) {
        prevScrollHeight.current = container.scrollHeight;
      }

      // nextChatId를 lastChatId로 사용하여 이전 메시지 조회
      console.log("📤 [handleLoadMore] 이전 메시지 조회 요청:", {
        chatroomId,
        lastChatId: nextChatId,
        messageHasNext,
      });
      await useChatStore.getState().fetchHistory(chatroomId, nextChatId);
    } catch (error) {
      console.error("이전 메시지 로드 실패:", error);
    }
  }, [messageHasNext, isLoadingHistory, chatroomId, nextChatId]);

  /**
   * 6. 스크롤 위치 제어
   */
  useEffect(() => {
    const currentLength = allMessages.length;
    const prevLength = prevMessagesLengthRef.current || 0;

    // 메시지가 없으면 스크롤하지 않음
    if (currentLength === 0) {
      return;
    }

    // 초기 로드 시: 메시지가 있고 첫 로드면 맨 아래로 스크롤 (한 번만)
    if (
      isInitialLoadRef.current &&
      currentLength > 0 &&
      !initialLoadCompleteRef.current
    ) {
      isInitialLoadRef.current = false;
      isScrollingRef.current = true;

      // 다음 프레임에서 스크롤 (DOM 렌더링 완료 후)
      setTimeout(() => {
        if (messagesEndRef.current && !initialLoadCompleteRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "auto" });
          setTimeout(() => {
            isScrollingRef.current = false;
            initialLoadCompleteRef.current = true; // 초기 로드 완료 표시
          }, 100);
        }
      }, 0);

      prevMessagesLengthRef.current = currentLength;
      return;
    }

    // 초기 로드가 완료되지 않았으면 스크롤하지 않음
    if (!initialLoadCompleteRef.current) {
      prevMessagesLengthRef.current = currentLength;
      return;
    }

    // 이전 메시지를 불러올 때는 스크롤 위치 유지
    if (prevScrollHeight.current > 0) {
      const container = observerTarget.current?.parentElement;
      if (container) {
        const newScrollHeight = container.scrollHeight;
        const heightDiff = newScrollHeight - prevScrollHeight.current;

        // 스크롤 중 플래그 설정 (IntersectionObserver 트리거 방지)
        isScrollingRef.current = true;

        // 스크롤 위치 조정 (새로 추가된 메시지 높이만큼 위로 이동)
        const newScrollTop = container.scrollTop + heightDiff;
        container.scrollTo({ top: newScrollTop, behavior: "auto" });
        prevScrollHeight.current = 0;

        // 스크롤 완료 후 플래그 해제
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 100);
      }

      prevMessagesLengthRef.current = currentLength;
      return;
    }

    // 새 메시지가 하단에 추가되었을 때만 맨 아래로 스크롤
    // (초기 로드가 완료된 후, 이전 메시지 개수가 0보다 클 때만)
    if (
      currentLength > prevLength &&
      prevLength > 0 &&
      initialLoadCompleteRef.current
    ) {
      const container = observerTarget.current?.parentElement;
      if (container) {
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100; // 하단 100px 이내에 있으면

        if (isNearBottom) {
          isScrollingRef.current = true;
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
          setTimeout(() => {
            isScrollingRef.current = false;
          }, 300);
        }
      }
    }

    // 이전 메시지 개수 업데이트
    prevMessagesLengthRef.current = currentLength;
  }, [allMessages]);

  /**
   * 7. 상단 스크롤 감지 - HomePage 패턴 적용
   */
  useEffect(() => {
    // 더 불러올 메시지가 없으면 observer 생성하지 않음
    if (!observerTarget.current || !messageHasNext || !chatroomId) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // 요소가 화면에 나타나고, 로딩 중이 아닐 때만 다음 페이지 요청 (HomePage 패턴)
        if (
          entries[0].isIntersecting &&
          !isLoadingHistory &&
          !isScrollingRef.current
        ) {
          handleLoadMore();
        }
      },
      { threshold: 1.0 } // 요소가 100% 다 보였을 때 실행 (HomePage 패턴)
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [handleLoadMore, messageHasNext, isLoadingHistory, chatroomId]);

  /**
   * 8. 메시지 전송
   */
  const onSend = () => {
    if (!inputValue.trim() || !chatroomId) return;

    // activeRoom에서 내 ID와 상대방 ID 가져오기
    if (!activeRoom?.myId || !activeRoom?.otherId) {
      console.error("⚠️ [onSend] activeRoom, myId 또는 otherId가 없습니다.");
      alert("채팅방 정보를 불러올 수 없습니다.");
      return;
    }

    const senderId = Number(activeRoom.myId);
    const receiverId = Number(activeRoom.otherId);

    console.log("📤 [onSend] 메시지 전송 시도:", {
      senderId,
      receiverId,
      text: inputValue,
      chatroomId,
      activeRoom,
    });

    // 소켓 전송 시 senderId, receiverId, chatroomId 포함
    sendMessage(senderId, receiverId, inputValue, chatroomId);
    setInputValue("");
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ChatRoomLayout role="main" aria-label="채팅방">
      <ChatRoomCard />
      <MessageList
        role="log"
        aria-label="채팅 메시지 목록"
        aria-live="polite"
        aria-atomic="false"
      >
        <div
          ref={observerTarget}
          style={{ height: "10px" }}
          className="sr-only"
          aria-label="이전 메시지 불러오기 영역"
        />

        {isLoadingHistory && (
          <LoadingText role="status" aria-live="polite">
            이전 대화 불러오는 중...
            <span className="sr-only">이전 메시지를 불러오는 중입니다</span>
          </LoadingText>
        )}

        {allMessages.map((msg) => {
          // 고유한 key 생성: id가 있으면 사용하고, 없으면 여러 속성을 조합하여 고유성 보장
          const uniqueKey = msg.id
            ? `msg-${msg.id}`
            : `${msg.chatroomId || chatroomId}-${msg.type}-${msg.senderId}-${
                msg.createdAt
              }-${msg.textContent?.substring(0, 10) || ""}`;

          // MATCH_CONFIRMATION 타입 메시지는 MatchResultCard로 렌더링
          if (msg.type === "MATCH_CONFIRMATION") {
            return (
              <MessageWrapper key={uniqueKey}>
                <MatchResultCard
                  message={msg}
                  onAcceptSuccess={handleAcceptSuccess}
                  onRefuseSuccess={handleRefuseSuccess}
                />
              </MessageWrapper>
            );
          }

          // MATCH_SUCCESS 타입 메시지는 MatchSuccessCard로 렌더링
          if (msg.type === "MATCH_SUCCESS") {
            return (
              <MessageWrapper key={uniqueKey}>
                <MatchSuccessCard message={msg} />
              </MessageWrapper>
            );
          }

          // MATCH_FAIL 타입 메시지는 MatchFailCard로 렌더링
          if (msg.type === "MATCH_FAIL") {
            return (
              <MessageWrapper key={uniqueKey}>
                <MatchFailCard />
              </MessageWrapper>
            );
          }

          // textContent가 빈 문자열이면 렌더링하지 않음 (MATCH_SUCCESS/MATCH_FAIL 등)
          if (!msg.textContent || msg.textContent.trim() === "") {
            return null;
          }

          // 일반 텍스트 메시지
          // [중요] senderId를 number로 변환하여 비교
          // myId와 비교하여 내가 보낸 메시지인지 판단
          const senderIdNum = Number(msg.senderId);
          const isMe = activeRoom?.myId
            ? senderIdNum === Number(activeRoom.myId)
            : false;

          return (
            <MessageRow
              key={uniqueKey}
              $isMe={isMe}
              role="article"
              aria-label={isMe ? "내가 보낸 메시지" : "받은 메시지"}
            >
              {isMe && (
                <MessageTime
                  aria-label={`전송 시간: ${formatTime(msg.createdAt)}`}
                >
                  {formatTime(msg.createdAt)}
                </MessageTime>
              )}
              <MessageBubble $isMe={isMe} role="text">
                {msg.textContent}
                <span className="sr-only">
                  {isMe ? "내가 보낸 메시지" : "받은 메시지"},{" "}
                  {formatTime(msg.createdAt)}
                </span>
              </MessageBubble>
              {!isMe && (
                <MessageTime
                  aria-label={`수신 시간: ${formatTime(msg.createdAt)}`}
                >
                  {formatTime(msg.createdAt)}
                </MessageTime>
              )}
            </MessageRow>
          );
        })}

        <div
          ref={messagesEndRef}
          className="sr-only"
          aria-label="메시지 목록 끝"
        />
      </MessageList>

      <InputArea role="form" aria-label="메시지 입력">
        <label htmlFor="chat-input" className="sr-only">
          메시지 입력란
        </label>
        <StyledInput
          id="chat-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.nativeEvent.isComposing) {
              onSend();
            }
          }}
          placeholder="메시지를 입력하세요..."
          aria-label="메시지 입력란"
          aria-describedby="send-button-description"
        />
        <span id="send-button-description" className="sr-only">
          Enter 키를 누르면 메시지가 전송됩니다
        </span>
        <SendButton
          onClick={onSend}
          disabled={!inputValue.trim()}
          aria-label="메시지 전송"
          aria-disabled={!inputValue.trim()}
        >
          <FaArrowCircleUp size={30} color="#FFBE00" aria-hidden="true" />
          <span className="sr-only">전송</span>
        </SendButton>
      </InputArea>
    </ChatRoomLayout>
  );
};

export default ChatRoom;

// --- 스타일 컴포넌트 (CSS) ---

const ChatRoomLayout = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  box-sizing: border-box;
  min-height: 100vh;
`;

const MessageList = styled.div`
  padding-top: 180px;
  padding-bottom: 80px;
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

const MessageWrapper = styled.div`
  width: 100%;

  margin-top: 16px;
`;

const InputArea = styled.div`
  display: flex;
  padding: 16px 0;
  background-color: white;
  border-top: 1px solid #ebebeb;
  position: fixed;
  width: 343px;
  bottom: 0;
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
