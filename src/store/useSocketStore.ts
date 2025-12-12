// store/useSocketStore.ts
import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../domain/chat/chat.types";

interface SocketStore {
  messages: ChatMessage[];
  connected: boolean;
  client: Client | null;

  connect: () => void;
  disconnect: () => void;
  sendMessage: (receiverId: number, text: string) => void;
  addMessage: (msg: ChatMessage) => void;
}

// ★ 테스트 환경 설정
const SOCKET_URL =
  "wss://bebee-chat-1036667053569.asia-northeast3.run.app/ws/chats";
const MY_TOKEN = "1";
const MY_MEMBER_ID = 1;

export const useSocketStore = create<SocketStore>((set, get) => ({
  messages: [],
  connected: false,
  client: null,

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
              get().addMessage(receivedMsg);
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
  sendMessage: (receiverId, text) => {
    const { client } = get();
    if (!client || !client.active) {
      console.warn("소켓이 연결되지 않았습니다.");
      return;
    }

    const payload = {
      receiverId: receiverId,
      type: "TEXT",
      textContent: text,
      createdAt: new Date().toISOString(),
    };

    // 서버로 전송 (Publish) -> /pub/chats
    client.publish({
      destination: "/pub/chats",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
    });
  },

  // 4. 메시지 추가 (UI 갱신용)
  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
}));
