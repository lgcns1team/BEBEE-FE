import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../domain/chat/chat.types";
import { useChatStore } from "../domain/chat/store/useChatStore";

interface SocketStore {
  messagesByChatroom: Record<string, ChatMessage[]>;
  connected: boolean;
  client: Client | null;
  connect: () => void;
  disconnect: () => void;
  sendMessage: (
    senderId: number,
    receiverId: number,
    text: string,
    chatroomId: string
  ) => void;
  sendMatchConfirmation: (
    receiverId: number,
    chatroomId: string,
    matchConfirmationData: {
      location: string;
      unitPoints: number;
      totalPoints: number;
      startDate?: string;
      endDate?: string;
      scheduleDays?: string[];
      scheduleStartTimes?: string[];
      scheduleEndTimes?: string[];
    }
  ) => void;
  addMessage: (msg: ChatMessage, chatroomId?: string) => void;
  clearMessages: (chatroomId?: string) => void;
  getMessages: (chatroomId: string) => ChatMessage[];
}

// 환경 변수 처리 (Vite 기준)
const SOCKET_URL = "wss://api.be-bee.link/chat/ws/chats";

export const useSocketStore = create<SocketStore>((set, get) => ({
  messagesByChatroom: {},
  connected: false,
  client: null,

  getMessages: (chatroomId: string) =>
    get().messagesByChatroom[chatroomId] || [],

  connect: () => {
    const token = 1;
    const memberId = 1;
    if (!token || !memberId) {
      console.error("토큰 또는 멤버 ID가 없습니다.");
      return;
    }

    const currentState = get();
    if (currentState.client?.active && currentState.connected) return;

    if (currentState.client) currentState.client.deactivate();

    //연결
    const client = new Client({
      brokerURL: SOCKET_URL,
      connectHeaders: {
        "accept-version": "1.2",
        host: window.location.hostname,
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) console.log("[STOMP Debug]:", str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,

      onConnect: () => {
        console.log("STOMP 연결 성공");
        set({ connected: true });
        //구독
        client.subscribe(
          `/sub/member:${memberId}`,
          (message) => {
            try {
              const receivedMsg: ChatMessage = JSON.parse(message.body);
              const chatroomId = receivedMsg.chatroomId;
              if (chatroomId) {
                get().addMessage(receivedMsg, chatroomId);
                useChatStore.getState().addMessage(receivedMsg, chatroomId);
              }
            } catch (e) {
              console.error("메시지 파싱 실패:", e);
            }
          },
          { id: `sub-${memberId}` } // ID 고유화
        );
      },

      onWebSocketError: (error) => {
        console.error("WebSocket Error:", error);
      },
      onStompError: (frame) => {
        console.error(" STOMP Error:", frame.headers["message"]);
      },
      onDisconnect: () => set({ connected: false }),
    });

    client.activate();
    set({ client });
  },

  disconnect: () => {
    const { client } = get();
    if (client) {
      client.deactivate();
      set({ client: null, connected: false });
    }
  },

  sendMessage: (senderId, receiverId, text, chatroomId) => {
    const { client, connected } = get();

    if (!client?.active || !connected) {
      console.warn("연결되지 않음. 재연결 시도...");
      get().connect();
      return;
    }

    const createdAt = new Date().toISOString();
    const payload = {
      receiverId,
      type: "TEXT",
      textContent: text,
      createdAt,
      chatroomId,
    };

    // UI 즉시 반영 (Optimistic Update)
    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      senderId: String(senderId),
      textContent: text,
      type: "TEXT",
      attachments: [],
      createdAt,
      chatroomId,
    };

    get().addMessage(tempMessage, chatroomId);
    useChatStore.getState().addMessage(tempMessage, chatroomId);

    client.publish({
      destination: "/pub/chats",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
    });
  },

  sendMatchConfirmation: (receiverId, chatroomId, matchConfirmationData) => {
    const { client, connected } = get();

    if (!client?.active || !connected) {
      console.warn(" 연결되지 않음. 재연결 시도...");
      get().connect();
      return;
    }

    const createdAt = new Date().toISOString();
    const payload = {
      receiverId,
      type: "MATCH_CONFIRMATION",
      location: matchConfirmationData.location,
      unitPoints: matchConfirmationData.unitPoints,
      totalPoints: matchConfirmationData.totalPoints,
      startDate: matchConfirmationData.startDate,
      endDate: matchConfirmationData.endDate,
      scheduleDays: matchConfirmationData.scheduleDays,
      scheduleStartTimes: matchConfirmationData.scheduleStartTimes,
      scheduleEndTimes: matchConfirmationData.scheduleEndTimes,
      createdAt,
    };

    console.log("] 매칭확인서 전송:", {
      receiverId,
      chatroomId,
      payload,
    });

    try {
      client.publish({
        destination: "/pub/chats",
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      });
      console.log(" 매칭확인서 전송 완료");
    } catch (error) {
      console.error("매칭확인서 전송 실패:", error);
    }
  },

  addMessage: (msg, chatroomId) =>
    set((state) => {
      const targetId = chatroomId || msg.chatroomId;
      if (!targetId) return state;

      const currentMessages = state.messagesByChatroom[targetId] || [];
      if (currentMessages.find((m) => m.id === msg.id)) return state;

      return {
        messagesByChatroom: {
          ...state.messagesByChatroom,
          [targetId]: [...currentMessages, msg],
        },
      };
    }),

  clearMessages: (chatroomId) =>
    set((state) => {
      if (chatroomId) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [chatroomId]: _, ...rest } = state.messagesByChatroom;
        return { messagesByChatroom: rest };
      }
      return { messagesByChatroom: {} };
    }),
}));
