import { useEffect, useCallback, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ChatRoomCard from "../components/ChatRoomCard";
import ChatInput from "../components/ChatInput";
import MessageList from "../components/MeessageList";
import { useChatStore } from "../store/useChatStore";
import { useSocketStore } from "../../../store/useSocketStore";
import { useUserStore } from "../../../store/useUserStore";
import { chatApi } from "../../../api/chatApi";
import type { MatchStatus } from "../types/chat.types";
import Layout from "../../../components/Layout";

const ChatRoom = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const {
    activeRoom,
    setActiveRoom,
    fetchHistory,
    updateMatchStatus,
    getMessages,
  } = useChatStore();
  const { connect, sendMessage } = useSocketStore();
  const { user } = useUserStore();
  const [srAnnouncement, setSrAnnouncement] = useState<string>("");

  // 현재 유효한 chatroomId를 추적하기 위한 ref
  const currentChatroomIdRef = useRef<string | undefined>(chatroomId);
  const isMountedRef = useRef(true);
  const chatInputRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const lastAnnouncedMessageIdRef = useRef<string | null>(null);
  const hasInitializedMessagesRef = useRef(false);

  const initialViewportHeightRef = useRef<number>(0);
  // PWA 환경에서 키보드가 올라갈 때 document 스크롤 제어
  useEffect(() => {
    // Visual Viewport API 지원 여부 확인
    const vv = window.visualViewport;
    if (!vv) return;
    const inputElement = chatInputRef.current;

    const handleViewportResize = () => {
      const visualViewport = window.visualViewport;
      const currentViewportHeight = visualViewport.height;

      // 초기 viewport 높이 저장
      if (initialViewportHeightRef.current === 0) {
        initialViewportHeightRef.current = currentViewportHeight;
      }

      // 키보드가 나타났는지 확인 (viewport 높이가 줄어들었는지)
      const heightDifference =
        initialViewportHeightRef.current - currentViewportHeight;
      const isKeyboardVisible = heightDifference > 50; // 50px 이상 차이나면 키보드로 간주
      const keyboardHeight = Math.max(
        0,
        window.innerHeight - vv.height - vv.offsetTop
      );
      if (isKeyboardVisible) {
        // 키보드가 나타났을 때: document 스크롤을 맨 위로 고정하여 ChatRoomCard가 상단에 유지되도록
        requestAnimationFrame(() => {
          window.scrollTo({
            top: 0,
            behavior: "instant" as ScrollBehavior,
          });
        });
        chatInputRef.current.style.bottom = isKeyboardVisible
          ? `${keyboardHeight}px`
          : "0px";
      } else {
        // 키보드가 사라졌을 때: 초기 높이 복원
        initialViewportHeightRef.current = currentViewportHeight;
      }
    };

    // Visual Viewport resize 이벤트 리스너 등록
    window.visualViewport.addEventListener("resize", handleViewportResize);
    window.visualViewport.addEventListener("scroll", handleViewportResize);

    // 초기 viewport 높이 저장
    initialViewportHeightRef.current = window.visualViewport.height;

    // Cleanup
    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleViewportResize
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        handleViewportResize
      );
      if (inputElement) {
        inputElement.style.bottom = "0px";
      }
    };
  }, []);

  // 1. 채팅방 정보 조회 및 소켓 연결
  useEffect(() => {
    if (!chatroomId) return;

    // 현재 chatroomId를 ref에 저장
    currentChatroomIdRef.current = chatroomId;
    isMountedRef.current = true;

    const initializeChatRoom = async () => {
      try {
        // 채팅방 정보 조회
        if (!activeRoom || activeRoom.chatroomId !== chatroomId) {
          const roomData = await chatApi.openChatRoom(undefined, chatroomId);

          // 요청 완료 후 chatroomId가 변경되었는지 확인
          if (
            currentChatroomIdRef.current !== chatroomId ||
            !isMountedRef.current
          ) {
            console.log("채팅방이 변경되어 응답 무시:", chatroomId);
            return;
          }

          setActiveRoom(roomData);
        }

        // 소켓 연결 (이미 연결되어 있으면 재연결하지 않음)
        connect();
      } catch (error) {
        console.error("채팅방 초기화 실패:", error);
      }
    };

    initializeChatRoom();

    // 컴포넌트 언마운트 또는 chatroomId 변경 시 cleanup
    return () => {
      isMountedRef.current = false;
      // 소켓 연결은 유지 (다른 채팅방에서도 사용하므로)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId]);

  // 2. 재입장 시 메시지 조회 (GET /chat/chatrooms/chats)
  useEffect(() => {
    if (!chatroomId) return;
    if (!activeRoom || activeRoom.chatroomId !== chatroomId) return;

    // 첫 로딩 시 메시지 조회
    fetchHistory(chatroomId, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId, activeRoom?.chatroomId]);

  // 3. 소켓 메시지 수신 처리 (MATCH_SUCCESS, MATCH_FAILURE 타입 처리)
  useEffect(() => {
    if (!chatroomId || !activeRoom) return;

    const messages = getMessages(chatroomId);

    // 최신 메시지에서 매칭 상태 확인
    const latestMatchMessage = [...messages]
      .reverse()
      .find(
        (msg) => msg.type === "MATCH_SUCCESS" || msg.type === "MATCH_FAILURE"
      );

    if (latestMatchMessage) {
      const newStatus: MatchStatus =
        latestMatchMessage.type === "MATCH_SUCCESS" ? "MATCHED" : "NON_MATCHED";

      // 현재 상태와 다를 때만 업데이트
      if (activeRoom.matchStatus !== newStatus) {
        updateMatchStatus(newStatus);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatroomId, activeRoom?.chatroomId, activeRoom?.matchStatus]);

  // 4. 텍스트 메시지 전송 함수
  const handleSend = useCallback(
    (text: string) => {
      if (!chatroomId || !activeRoom || !user) {
        console.warn("메시지 전송 실패: 필수 정보가 없습니다.");
        return;
      }

      const senderId = Number(user.memberId);
      const receiverId = Number(activeRoom.otherId);

      // 소켓으로 텍스트 메시지 발행
      sendMessage(senderId, receiverId, text, chatroomId);
    },
    [chatroomId, activeRoom, user, sendMessage]
  );

  const formatTimeForSr = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const hh = String(displayHours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    return `${period}${hh}시${mm}분`;
  };

  // 메시지 추가 시, "내가 보낸 메시지"만 별도 라이브 영역으로 깔끔하게 읽기
  const messages = chatroomId ? getMessages(chatroomId) : [];
  const messageCount = messages.length;
  const lastMessage = messageCount > 0 ? messages[messageCount - 1] : null;
  const lastMessageId = lastMessage?.id ?? null;
  const lastMessageSenderId = lastMessage?.senderId ?? null;
  const lastMessageType = lastMessage?.type ?? null;
  const lastMessageText = lastMessage?.textContent ?? "";
  const lastMessageCreatedAt = lastMessage?.createdAt ?? "";

  useEffect(() => {
    if (!chatroomId) return;
    // 최초 로딩(히스토리 세팅)에서는 읽지 않도록 초기화만
    if (!hasInitializedMessagesRef.current) {
      hasInitializedMessagesRef.current = true;
      lastAnnouncedMessageIdRef.current = lastMessageId;
      return;
    }

    if (!lastMessageId || lastMessageId === lastAnnouncedMessageIdRef.current)
      return;
    lastAnnouncedMessageIdRef.current = lastMessageId;

    // 내가 보낸 TEXT 메시지만 즉시 읽기 (불필요한 안내 멘트 최소화)
    if (
      user &&
      lastMessageSenderId === String(user.memberId) &&
      lastMessageType === "TEXT"
    ) {
      const content = lastMessageText?.trim() || "내용 없음";
      setSrAnnouncement(
        `내가보낸메세지 ${formatTimeForSr(lastMessageCreatedAt)} ${content}`
      );
    }
  }, [
    chatroomId,
    messageCount,
    lastMessage,
    lastMessageId,
    lastMessageSenderId,
    lastMessageType,
    lastMessageText,
    lastMessageCreatedAt,
    user,
  ]);

  return (
    <Layout aria-label="채팅방">
      <div
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {srAnnouncement}
      </div>
      <ChatContainer ref={chatContainerRef}>
        <ChatRoomCard />
        <MessageList />
        <ChatInputWrapper ref={chatInputRef}>
          <ChatInput onSend={handleSend} />
        </ChatInputWrapper>
      </ChatContainer>
    </Layout>
  );
};

export default ChatRoom;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  overscroll-behavior: contain;
`;

const ChatInputWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  flex-shrink: 0;
  width: 100%;
  background: white;
  z-index: 30;
`;
