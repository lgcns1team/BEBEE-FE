// store/useSocketStore.ts
import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../domain/chat/chat.types";

interface SocketStore {
  // 채팅방별 소켓 메시지 관리
  messagesByChatroom: Record<string, ChatMessage[]>;
  connected: boolean;
  client: Client | null;

  connect: () => void;
  disconnect: () => void;
  sendMessage: (receiverId: number, text: string, chatroomId?: string) => void;
  addMessage: (msg: ChatMessage, chatroomId?: string) => void;
  clearMessages: (chatroomId?: string) => void;
  getMessages: (chatroomId: string) => ChatMessage[];
}

// ★ 테스트 환경 설정
const SOCKET_URL =
  "wss://bebee-chat-1036667053569.asia-northeast3.run.app/ws/chats";
const MY_TOKEN = "1";
const MY_MEMBER_ID = 1;

export const useSocketStore = create<SocketStore>((set, get) => ({
  messagesByChatroom: {},
  connected: false,
  client: null,

  getMessages: (chatroomId: string) => {
    return get().messagesByChatroom[chatroomId] || [];
  },

  // 1. 소켓 연결
  connect: () => {
    // 이미 연결되어 있다면 중단
    if (get().client?.active) return;

    const client = new Client({
      brokerURL: SOCKET_URL,
      connectHeaders: {
        "accept-version": "1.2",
        host: "localhost",
        Authorization: `Bearer ${MY_TOKEN}`,
      },
      debug: (str) => {
        console.log("[STOMP Debug]:", str);
      },

      // 연결 성공 시
      onConnect: () => {
        console.log("연결 성공");
        set({ connected: true });

        // 구독 (Subscribe): 나에게 오는 메시지 수신
        // 경로: /sub/member:{내ID}
        client.subscribe(
          `/sub/member:${MY_MEMBER_ID}`,
          (message) => {
            try {
              const receivedMsg: ChatMessage = JSON.parse(message.body);
              console.log("📩 수신 메시지:", receivedMsg);
              // 소켓 메시지에 chatroomId가 있으면 사용, 없으면 activeRoom에서 가져오기
              const chatroomId = receivedMsg.chatroomId;
              if (chatroomId) {
                get().addMessage(receivedMsg, chatroomId);
              } else {
                console.warn(
                  "⚠️ [socket] 수신 메시지에 chatroomId가 없습니다:",
                  receivedMsg
                );
                // chatroomId가 없으면 메시지를 추가하지 않음
              }
            } catch (e) {
              console.error("메시지 파싱 실패:", e);
            }
          },
          { id: String(MY_MEMBER_ID) }
        );
      },

      // 연결 끊김/에러 처리
      onDisconnect: () => {
        console.log("연결 안 됨");
        set({ connected: false });
      },
      onStompError: (frame) => {
        console.error("Broker reported error: " + frame.headers["message"]);
      },
    });

    client.activate();
    set({ client });
  },

  // 2. 연결 해제
  disconnect: () => {
    const { client } = get();
    if (client) {
      client.deactivate();
      set({ client: null, connected: false });
    }
  },

  // 3. 메시지 전송
  sendMessage: (receiverId, text, chatroomId?: string) => {
    const { client } = get();
    if (!client || !client.active) {
      console.warn("⚠️ [sendMessage] 소켓이 연결되지 않았습니다.");
      return;
    }

    const createdAt = new Date().toISOString();
    const messageId = `temp-${Date.now()}-${Math.random()}`;

    const payload: {
      receiverId: number;
      type: string;
      textContent: string;
      createdAt: string;
      chatroomId?: string;
    } = {
      receiverId: receiverId,
      type: "TEXT",
      textContent: text,
      createdAt: createdAt,
    };

    // chatroomId가 있으면 포함
    if (chatroomId) {
      payload.chatroomId = chatroomId;
    }

    console.log("📤 [sendMessage] 메시지 전송:", {
      receiverId,
      text,
      chatroomId,
      payload,
    });

    // 즉시 UI에 표시하기 위해 로컬 메시지 추가 (임시 ID 사용)
    if (!chatroomId) {
      console.warn(
        "⚠️ [sendMessage] chatroomId가 없어 메시지를 추가할 수 없습니다."
      );
      return;
    }

    const tempMessage: ChatMessage = {
      id: messageId,
      senderId: String(MY_MEMBER_ID),
      textContent: text,
      type: "TEXT",
      attachments: [],
      createdAt: createdAt,
      chatroomId: chatroomId,
    };
    get().addMessage(tempMessage, chatroomId);
    console.log(
      "✅ [sendMessage] 로컬 메시지 추가 (즉시 UI 표시):",
      tempMessage
    );

    // 서버로 전송 (Publish) -> /pub/chats
    try {
      client.publish({
        destination: "/pub/chats",
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      });
      console.log("✅ [sendMessage] 서버로 메시지 전송 완료");
    } catch (error) {
      console.error("❌ [sendMessage] 메시지 전송 실패:", error);
    }
  },

  // 4. 메시지 추가 (UI 갱신용) - 중복 체크 포함, 채팅방별 관리
  addMessage: (msg, chatroomId?: string) =>
    set((state) => {
      // chatroomId가 없으면 메시지의 chatroomId 사용
      const targetChatroomId = chatroomId || msg.chatroomId;

      if (!targetChatroomId) {
        console.warn(
          "⚠️ [socket addMessage] chatroomId가 없어 메시지를 추가할 수 없습니다:",
          msg
        );
        return state;
      }

      const currentMessages = state.messagesByChatroom[targetChatroomId] || [];

      // 중복 체크: 같은 ID를 가진 메시지가 이미 있으면 추가하지 않음
      const existingIds = new Set(currentMessages.map((m) => m.id));
      if (existingIds.has(msg.id)) {
        console.log(
          "⚠️ [socket addMessage] 중복 메시지 ID 감지, 추가하지 않음:",
          msg.id,
          "chatroomId:",
          targetChatroomId
        );
        return state;
      }

      // MATCH_CONFIRMATION 타입 메시지는 agreementId로도 중복 체크
      if (msg.type === "MATCH_CONFIRMATION" && msg.agreementId) {
        const existingAgreementIds = new Set(
          currentMessages.filter((m) => m.agreementId).map((m) => m.agreementId)
        );
        if (existingAgreementIds.has(msg.agreementId)) {
          console.log(
            "⚠️ [socket addMessage] 중복 매칭 확인서 감지 (agreementId), 추가하지 않음:",
            msg.agreementId,
            "chatroomId:",
            targetChatroomId
          );
          return state;
        }
      }

      console.log("✅ [socket addMessage] 메시지 추가:", {
        id: msg.id,
        type: msg.type,
        chatroomId: targetChatroomId,
      });

      return {
        messagesByChatroom: {
          ...state.messagesByChatroom,
          [targetChatroomId]: [...currentMessages, msg],
        },
      };
    }),

  // 5. 메시지 초기화 (특정 채팅방 또는 전체)
  clearMessages: (chatroomId?: string) =>
    set((state) => {
      if (chatroomId) {
        // 특정 채팅방의 소켓 메시지만 초기화
        const updated = { ...state.messagesByChatroom };
        delete updated[chatroomId];
        return { messagesByChatroom: updated };
      } else {
        // chatroomId가 없으면 모든 소켓 메시지 초기화
        return { messagesByChatroom: {} };
      }
    }),
}));
