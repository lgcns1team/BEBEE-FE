import { useEffect, useCallback } from "react";
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

const ChatRoom = () => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const {
    activeRoom,
    setActiveRoom,
    fetchHistory,
    updateMatchStatus,
    getMessages,
  } = useChatStore();
  const { connect, disconnect, sendMessage } = useSocketStore();
  const { user } = useUserStore();

  // 1. 채팅방 정보 조회 및 소켓 연결
  useEffect(() => {
    if (!chatroomId) return;

    const initializeChatRoom = async () => {
      try {
        // 채팅방 정보 조회
        if (!activeRoom || activeRoom.chatroomId !== chatroomId) {
          const roomData = await chatApi.openChatRoom(undefined, chatroomId);
          setActiveRoom(roomData);
        }

        // 소켓 연결
        connect();
      } catch (error) {
        console.error("채팅방 초기화 실패:", error);
      }
    };

    initializeChatRoom();

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      disconnect();
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
  }, [chatroomId, activeRoom?.chatroomId, getMessages(chatroomId).length]);

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

  return (
    <ChatRoomLayout role="main" aria-label="채팅방">
      <span className="sr-only">채팅방 페이지입니다. </span>
      <ChatRoomCard />
      <MessageListContainer aria-live="polite" aria-relevant="additions">
        <MessageList />
      </MessageListContainer>
      <ChatInput onSend={handleSend} />
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

const MessageListContainer = styled.div`
  padding-top: 180px;
  padding-bottom: 80px;
  flex: 1;
  overflow-y: auto;
`;
