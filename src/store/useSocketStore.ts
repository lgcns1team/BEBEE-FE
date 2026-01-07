// store/useSocketStore.ts
import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../domain/chat/chat.types";
import { useChatStore } from "../domain/chat/store/useChatStore";

interface SocketStore {
  // 채팅방별 소켓 메시지 관리
  messagesByChatroom: Record<string, ChatMessage[]>;
  connected: boolean;
  client: Client | null;

  connect: () => void;
  disconnect: () => void;
  sendMessage: (senderId: number, receiverId: number, text: string, chatroomId?: string) => void;
  addMessage: (msg: ChatMessage, chatroomId?: string) => void;
  clearMessages: (chatroomId?: string) => void;
  getMessages: (chatroomId: string) => ChatMessage[];
}

// 소켓 URL 설정 (환경 변수 또는 기본값)
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  "wss://bebee-chat-1036667053569.asia-northeast3.run.app/ws/chats";
const MY_TOKEN = "1";
const MY_MEMBER_ID = 1;

// URL에서 호스트 추출 함수
const getHostFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    // URL 파싱 실패 시 기본값 반환
    return "localhost";
  }
};

export const useSocketStore = create<SocketStore>((set, get) => ({
  messagesByChatroom: {},
  connected: false,
  client: null,

  getMessages: (chatroomId: string) => {
    return get().messagesByChatroom[chatroomId] || [];
  },

  // 1. 소켓 연결
  connect: () => {
    const currentState = get();
    // 이미 연결되어 있고 활성 상태라면 중단
    if (currentState.client?.active && currentState.connected) {
      console.log("ℹ️ [connect] 이미 연결되어 있습니다.");
      return;
    }

    // 기존 클라이언트가 있으면 정리
    if (currentState.client) {
      try {
        currentState.client.deactivate();
      } catch (e) {
        console.warn("⚠️ [connect] 기존 클라이언트 정리 중 오류:", e);
      }
    }

    const client = new Client({
      brokerURL: SOCKET_URL,
      connectHeaders: {
        "accept-version": "1.2",
        host: getHostFromUrl(SOCKET_URL),
        Authorization: `Bearer ${MY_TOKEN}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log("[STOMP Debug]:", str);
        }
      },
      // 재연결 설정
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      // 연결 성공 시
      onConnect: () => {
        console.log("✅ [connect] STOMP 연결 성공");
        set({ connected: true });

        // 구독 (Subscribe): 나에게 오는 메시지 수신
        // 경로: /sub/member:{내ID}
        try {
          client.subscribe(
            `/sub/member:${MY_MEMBER_ID}`,
            (message) => {
              try {
                const receivedMsg: ChatMessage = JSON.parse(message.body);
                console.log("📩 [socket] 수신 메시지:", receivedMsg);
                // 소켓 메시지에 chatroomId가 있으면 사용, 없으면 activeRoom에서 가져오기
                const chatroomId = receivedMsg.chatroomId;
                if (chatroomId) {
                  // 1. useSocketStore에 추가 (즉시 UI 표시)
                  get().addMessage(receivedMsg, chatroomId);
                  // 2. useChatStore에 추가 (영구 저장 - localStorage)
                  useChatStore.getState().addMessage(receivedMsg, chatroomId);
                  console.log("✅ [socket] 소켓 메시지를 useChatStore에도 저장 완료");
                } else {
                  console.warn(
                    "⚠️ [socket] 수신 메시지에 chatroomId가 없습니다:",
                    receivedMsg
                  );
                  // chatroomId가 없으면 메시지를 추가하지 않음
                }
              } catch (e) {
                console.error("❌ [socket] 메시지 파싱 실패:", e);
              }
            },
            { id: String(MY_MEMBER_ID) }
          );
          console.log("✅ [connect] 구독 완료: /sub/member:" + MY_MEMBER_ID);
        } catch (e) {
          console.error("❌ [connect] 구독 실패:", e);
        }
      },

      // WebSocket 연결 실패 시
      onWebSocketError: (event) => {
        console.error("❌ [connect] WebSocket 연결 실패:", event);
        set({ connected: false });
      },

      // 연결 끊김/에러 처리
      onDisconnect: () => {
        console.log("⚠️ [connect] 연결 끊김");
        set({ connected: false });
      },
      
      onStompError: (frame) => {
        console.error("❌ [connect] STOMP 에러:", frame.headers["message"]);
        set({ connected: false });
      },
    });

    try {
      client.activate();
      set({ client, connected: false }); // 연결 중 상태로 설정
      console.log("🔄 [connect] 소켓 연결 시도 중...");
    } catch (error) {
      console.error("❌ [connect] 소켓 활성화 실패:", error);
      set({ connected: false });
    }
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
  sendMessage: (senderId, receiverId, text, chatroomId?: string) => {
    const { client, connected } = get();
    
    // 연결 상태 확인: client가 있고, active 상태이며, connected 상태여야 함
    if (!client || !client.active || !connected) {
      console.warn("⚠️ [sendMessage] 소켓이 연결되지 않았습니다.", {
        hasClient: !!client,
        isActive: client?.active,
        isConnected: connected,
      });
      
      // 연결이 안 되어 있으면 연결 시도
      if (!client || !client.active) {
        console.log("🔄 [sendMessage] 소켓 연결 시도 중...");
        get().connect();
      }
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
      senderId,
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
      senderId: String(senderId),
      textContent: text,
      type: "TEXT",
      attachments: [],
      createdAt: createdAt,
      chatroomId: chatroomId,
    };
    // 1. useSocketStore에 추가 (즉시 UI 표시)
    get().addMessage(tempMessage, chatroomId);
    // 2. useChatStore에 추가 (영구 저장 - localStorage)
    useChatStore.getState().addMessage(tempMessage, chatroomId);
    console.log(
      "✅ [sendMessage] 로컬 메시지 추가 (즉시 UI 표시 및 영구 저장):",
      tempMessage
    );

    // 서버로 전송 (Publish) -> /pub/chats
    // 연결 상태를 다시 한 번 확인 (publish 직전)
    if (!client.active || !connected) {
      console.error("❌ [sendMessage] publish 직전 연결 상태 확인 실패:", {
        isActive: client.active,
        isConnected: connected,
      });
      return;
    }

    try {
      // STOMP 연결이 완전히 준비되었는지 확인
      // client.active와 connected 상태 모두 확인
      if (!client.active) {
        console.error("❌ [sendMessage] WebSocket이 활성화되지 않았습니다.");
        return;
      }

      if (!connected) {
        console.error("❌ [sendMessage] STOMP 연결이 완료되지 않았습니다.");
        return;
      }

      client.publish({
        destination: "/pub/chats",
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      });
      console.log("✅ [sendMessage] 서버로 메시지 전송 완료");
    } catch (error) {
      console.error("❌ [sendMessage] 메시지 전송 실패:", error);
      // 연결이 끊어진 경우 재연결 시도
      if (
        error instanceof Error &&
        (error.message.includes("STOMP connection") ||
          error.message.includes("underlying STOMP connection"))
      ) {
        console.log("🔄 [sendMessage] 연결 끊김 감지, 재연결 시도...");
        set({ connected: false });
        get().disconnect();
        setTimeout(() => {
          get().connect();
        }, 1000);
      }
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
