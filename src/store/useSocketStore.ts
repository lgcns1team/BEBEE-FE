import { create } from "zustand";
import { Client } from "@stomp/stompjs";
import type { ChatMessage } from "../domain/chat/types/chat.types";
import { useChatStore } from "../domain/chat/store/useChatStore";
import { useUserStore } from "./useUserStore";

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

  getMessages: (chatroomId: string) =>
    get().messagesByChatroom[chatroomId] || [],

  connect: () => {
    const userStore = useUserStore.getState();
    const token = userStore.accessToken;
    const memberId = userStore.user?.memberId;

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
              console.log("[웹소켓] 파싱된 메시지:", receivedMsg);

              // chatroomId 결정 로직
              // 1. 메시지에 직접 포함된 chatroomId
              // 2. MATCH_CONFIRMATION 타입인 경우 matchData에서 확인 (만약 서버가 여기에 포함시킨다면)
              // 3. activeRoom의 chatroomId (현재 열려있는 채팅방)
              let chatroomId = receivedMsg.chatroomId;

              // MATCH_CONFIRMATION 타입이고 chatroomId가 없으면 activeRoom 확인
              if (!chatroomId) {
                const activeRoom = useChatStore.getState().activeRoom;
                chatroomId = activeRoom?.chatroomId;
                console.log(
                  "📨 [웹소켓] chatroomId 없음, activeRoom 사용:",
                  chatroomId,
                  "메시지 타입:",
                  receivedMsg.type
                );
              }

              // chatroomId가 있어야만 메시지 추가
              if (chatroomId) {
                console.log(" [웹소켓] addMessage 호출:", {
                  chatroomId,
                  messageId: receivedMsg.id,
                  messageType: receivedMsg.type,
                  textContent: receivedMsg.textContent,
                  hasMatchData: !!receivedMsg.matchData,
                });
                // useChatStore의 addMessage만 사용 (중복 체크 포함)
                useChatStore.getState().addMessage(receivedMsg, chatroomId);

                // MATCH_SUCCESS 또는 MATCH_FAILURE 메시지 수신 시 matchStatus 업데이트
                if (receivedMsg.type === "MATCH_SUCCESS") {
                  console.log(
                    " MATCH_SUCCESS 수신, matchStatus를 MATCHED로 업데이트"
                  );
                  useChatStore.getState().updateMatchStatus("MATCHED");
                } else if (receivedMsg.type === "MATCH_FAILURE") {
                  console.log(
                    "❌ MATCH_FAILURE 수신, matchStatus를 NON_MATCHED로 업데이트"
                  );
                  useChatStore.getState().updateMatchStatus("NON_MATCHED");
                }
              } else {
                console.warn("chatroomId를 찾을 수 없어 메시지 무시:", {
                  messageId: receivedMsg.id,
                  messageType: receivedMsg.type,
                  receivedChatroomId: receivedMsg.chatroomId,
                  activeRoomChatroomId:
                    useChatStore.getState().activeRoom?.chatroomId,
                });
              }
            } catch (e) {
              console.error("❌ [웹소켓] 메시지 파싱 실패:", e, message.body);
            }
          },
          { id: `sub-${memberId}` } // ID 고유화
        );

        // 연결 완료 후 대기 중인 매칭확인서 전송
        const pending = get().pendingMatchConfirmations;
        if (pending.length > 0) {
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
      chatroomId,
      receiverId,
      type: "TEXT",
      textContent: text,
      createdAt,
    };

    // Optimistic Update 제거: 서버에서 받은 메시지만 표시하도록 변경
    // (중복 메시지 방지를 위해)

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
