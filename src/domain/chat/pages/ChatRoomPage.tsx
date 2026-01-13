import { useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
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

  // 현재 유효한 chatroomId를 추적하기 위한 ref
  const currentChatroomIdRef = useRef<string | undefined>(chatroomId);
  const isMountedRef = useRef(true);

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

  return (
    <Layout aria-label="채팅방">
      <span className="sr-only">채팅방 페이지입니다. </span>
      <ChatRoomCard />
        <MessageList />
      <ChatInput onSend={handleSend} />
    </Layout>
  );
};

export default ChatRoom;
