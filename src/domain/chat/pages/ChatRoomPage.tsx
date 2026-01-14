import { useEffect, useCallback, useRef } from "react";
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

  // 현재 유효한 chatroomId를 추적하기 위한 ref
  const currentChatroomIdRef = useRef<string | undefined>(chatroomId);
  const isMountedRef = useRef(true);
  const initialViewportHeightRef = useRef<number>(0);
  const chatInputRef = useRef<HTMLDivElement>(null);

  // PWA 환경에서 키보드가 올라갈 때 document 스크롤 제어 및 ChatInput 위치 조정
  useEffect(() => {
    // Visual Viewport API 지원 여부 확인
    if (!window.visualViewport) {
      return;
    }

    // ref를 변수에 저장하여 cleanup에서 사용
    const inputElement = chatInputRef.current;

    const handleViewportResize = () => {
      const visualViewport = window.visualViewport;
      const currentViewportHeight = visualViewport.height;
      const windowHeight = window.innerHeight;

      // 초기 viewport 높이 저장
      if (initialViewportHeightRef.current === 0) {
        initialViewportHeightRef.current = currentViewportHeight;
      }

      // 키보드가 나타났는지 확인 (viewport 높이가 줄어들었는지)
      const heightDifference =
        initialViewportHeightRef.current - currentViewportHeight;
      const isKeyboardVisible = heightDifference > 50; // 50px 이상 차이나면 키보드로 간주

      if (isKeyboardVisible) {
        // 키보드가 나타났을 때
        requestAnimationFrame(() => {
          // document 스크롤을 맨 위로 고정하여 ChatRoomCard가 상단에 유지되도록
          window.scrollTo({
            top: 0,
            behavior: "instant" as ScrollBehavior,
          });

          // ChatInput을 키보드 위로 올리기
          const currentInputElement = chatInputRef.current;
          if (currentInputElement) {
            // 키보드 높이 계산 (window 높이 - viewport 높이)
            const keyboardHeight = windowHeight - currentViewportHeight;
            // ChatInput을 키보드 위에 위치시키기 위해 bottom 값을 키보드 높이로 설정
            currentInputElement.style.bottom = `${keyboardHeight}px`;
            currentInputElement.style.position = "fixed";
          }
        });
      } else {
        // 키보드가 사라졌을 때: 초기 높이 복원 및 ChatInput 위치 초기화
        initialViewportHeightRef.current = currentViewportHeight;
        const currentInputElement = chatInputRef.current;
        if (currentInputElement) {
          currentInputElement.style.bottom = "0";
          currentInputElement.style.position = "sticky";
        }
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
      // Cleanup 시 ChatInput 위치 초기화
      if (inputElement) {
        inputElement.style.bottom = "0";
        inputElement.style.position = "sticky";
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

  return (
    <Layout aria-label="채팅방">
      <span className="sr-only">채팅방 페이지입니다. </span>
      <ChatContainer>
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
  /* PWA 환경에서 키보드가 올라갈 때 document 스크롤 방지 */
  overscroll-behavior: contain;
`;

const ChatInputWrapper = styled.div`
  flex-shrink: 0;
  width: 100%;
  left: 0;
  right: 0;
`;
