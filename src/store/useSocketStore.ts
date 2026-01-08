import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../domain/chat/chat.types";
import { useChatStore } from "../domain/chat/store/useChatStore";

interface PendingMatchConfirmation {
  receiverId: number;
  chatroomId: string;
  matchConfirmationData: {
    location: string;
    unitPoints: number;
    totalPoints: number;
    startDate?: string;
    endDate?: string;
    scheduleDays?: string[];
    scheduleStartTimes?: string[];
    scheduleEndTimes?: string[];
  };
}

interface SocketStore {
  messagesByChatroom: Record<string, ChatMessage[]>;
  connected: boolean;
  client: Client | null;
  pendingMatchConfirmations: PendingMatchConfirmation[];
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
  pendingMatchConfirmations: [],

  getMessages: (chatroomId: string) => {
    const state = get();
    if (!state.messagesByChatroom || !chatroomId) {
      return [];
    }
    const messages = state.messagesByChatroom[chatroomId];
    return Array.isArray(messages) ? messages : [];
  },

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

        // 연결 완료 후 대기 중인 매칭확인서 전송
        const pending = get().pendingMatchConfirmations;
        if (pending.length > 0) {
          console.log(
            `📤 [onConnect] 대기 중인 매칭확인서 ${pending.length}개 전송 시작`
          );
          pending.forEach((pendingConfirmation) => {
            get().sendMatchConfirmation(
              pendingConfirmation.receiverId,
              pendingConfirmation.chatroomId,
              pendingConfirmation.matchConfirmationData
            );
          });
          set({ pendingMatchConfirmations: [] });
        }
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

    console.log("📤 [sendMatchConfirmation] 매칭확인서 Socket 전송 시작:", {
      receiverId,
      chatroomId,
      matchConfirmationData,
      clientActive: client?.active,
      connected,
    });

    if (!client?.active || !connected) {
      console.warn(
        "⚠️ [sendMatchConfirmation] 연결되지 않음. 대기열에 추가 후 재연결 시도..."
      );
      // 대기열에 추가
      set((state) => ({
        pendingMatchConfirmations: [
          ...state.pendingMatchConfirmations,
          { receiverId, chatroomId, matchConfirmationData },
        ],
      }));
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

    console.log("매칭확인서 Payload:", {
      receiverId,
      chatroomId,
      payload: JSON.stringify(payload, null, 2),
      destination: "/pub/chats",
    });

    try {
      client.publish({
        destination: "/pub/chats",
        body: JSON.stringify(payload),
        headers: { "content-type": "application/json" },
      });
      console.log(" 매칭확인서 Socket 전송 완료:", {
        receiverId,
        chatroomId,
        timestamp: createdAt,
      });
    } catch (error) {
      console.error("매칭확인서 Socket 전송 실패:", {
        error,
        receiverId,
        chatroomId,
        payload,
      });
    }
  },

  addMessage: (msg, chatroomId) =>
    set((state) => {
      const targetId = chatroomId || msg?.chatroomId;
      if (!targetId || !msg) return state;

      // 안전한 접근 보장
      const currentMessages = state.messagesByChatroom?.[targetId];
      const safeCurrentMessages = Array.isArray(currentMessages)
        ? currentMessages
        : [];

      // 중복 체크
      if (msg.id && safeCurrentMessages.find((m) => m?.id === msg.id)) {
        return state;
      }

      return {
        messagesByChatroom: {
          ...(state.messagesByChatroom || {}),
          [targetId]: [...safeCurrentMessages, msg],
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
