import { create } from "zustand";
import { chatApi } from "../api/chatApi";
import type {
  ChatroomResponse,
  ChatroomListItem,
  ChatroomListResponse,
  ChatMessage,
  ChatMessagesGetResDTO, // 기존 ChatMessageResponse에서 이름 변경됨
} from "../chat.types";

interface ChatState {
  // 1. 상세 채팅방 관련
  activeRoom: ChatroomResponse | null;
  setActiveRoom: (room: ChatroomResponse | null) => void;

  // 2. 채팅 목록 관련
  chatrooms: ChatroomListItem[];
  hasNext: boolean;
  nextChatroomId: string | null; // number -> string | null
  setChatrooms: (data: ChatroomListResponse, isMore?: boolean) => void;

  // 3. 채팅 메시지 내역 관련 (채팅방별로 관리)
  // 채팅방 ID를 키로 하는 메시지 맵
  messagesByChatroom: Record<
    string,
    {
      messages: ChatMessage[];
      messageHasNext: boolean;
      nextChatId: string | null;
    }
  >;

  isLoadingHistory: boolean;

  // 현재 활성 채팅방의 메시지 조회 헬퍼
  getHistoryMessages: (chatroomId?: string) => ChatMessage[];
  getMessageHasNext: (chatroomId?: string) => boolean;
  getNextChatId: (chatroomId?: string) => string | null;

  fetchHistory: (
    chatroomId: string,
    lastChatId?: string | null
  ) => Promise<void>;
  clearHistory: (chatroomId?: string) => void;
  addMessage: (message: ChatMessage, chatroomId?: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeRoom: null,
  chatrooms: [],
  hasNext: false,
  nextChatroomId: null,

  messagesByChatroom: {},
  isLoadingHistory: false,

  getHistoryMessages: (chatroomId?: string) => {
    const targetChatroomId = chatroomId || get().activeRoom?.chatroomId;
    if (!targetChatroomId) return [];
    return get().messagesByChatroom[targetChatroomId]?.messages || [];
  },

  getMessageHasNext: (chatroomId?: string) => {
    const targetChatroomId = chatroomId || get().activeRoom?.chatroomId;
    if (!targetChatroomId) return false;
    return get().messagesByChatroom[targetChatroomId]?.messageHasNext || false;
  },

  getNextChatId: (chatroomId?: string) => {
    const targetChatroomId = chatroomId || get().activeRoom?.chatroomId;
    if (!targetChatroomId) return null;
    return get().messagesByChatroom[targetChatroomId]?.nextChatId || null;
  },

  setActiveRoom: (room) => set({ activeRoom: room }),

  setChatrooms: (data, isMore = false) =>
    set((state) => {
      if (isMore) {
        // 중복 제거: 기존 chatroomId를 Set으로 관리하여 중복 방지
        const existingIds = new Set(
          state.chatrooms.map((room) => room.chatroomId)
        );
        const newRooms = (data?.chatrooms ?? []).filter(
          (room) => !existingIds.has(room.chatroomId)
        );
        return {
          chatrooms: [...(state.chatrooms ?? []), ...newRooms],
          hasNext: data?.hasNext ?? false,
          nextChatroomId: data?.nextChatroomId ?? null,
        };
      }
      return {
        chatrooms: data?.chatrooms ?? [],
        hasNext: data?.hasNext ?? false,
        nextChatroomId: data?.nextChatroomId ?? null,
      };
    }),

  fetchHistory: async (chatroomId, lastChatId = null) => {
    if (get().isLoadingHistory) return;

    set({ isLoadingHistory: true });
    try {
      // API 응답 타입 ChatMessagesGetResDTO 반영
      const data: ChatMessagesGetResDTO = await chatApi.getMessages(
        chatroomId,
        lastChatId
      );

      set((state) => {
        const currentChatroomMessages = state.messagesByChatroom[
          chatroomId
        ] || {
          messages: [],
          messageHasNext: false,
          nextChatId: null,
        };

        let updatedMessages: ChatMessage[];

        // lastChatId가 null이면 초기 로드: 서버 메시지와 기존 메시지 병합
        // lastChatId가 있으면 이전 메시지 로드: 기존 메시지 앞에 추가
        if (lastChatId) {
          // 이전 메시지 로드: 기존 메시지 앞에 추가
          updatedMessages = [
            ...(data?.messages ?? []),
            ...currentChatroomMessages.messages,
          ];
        } else {
          // 초기 로드 시: 서버 메시지와 기존 메시지(MATCH_CONFIRMATION 등) 병합
          const existingMatchMessages = currentChatroomMessages.messages.filter(
            (msg) => msg.type === "MATCH_CONFIRMATION"
          );
          let serverMessages = data?.messages ?? [];

          // 서버 메시지 배열 내에서도 중복 제거 (agreementId 기준)
          const seenAgreementIds = new Set<string>();
          const seenMessageIds = new Set<string>();
          serverMessages = serverMessages.filter((msg) => {
            // ID 중복 체크
            if (seenMessageIds.has(msg.id)) {
              console.log(
                "⚠️ [fetchHistory] 서버 메시지 ID 중복 제거:",
                msg.id
              );
              return false;
            }
            seenMessageIds.add(msg.id);

            // MATCH_CONFIRMATION 타입은 agreementId로도 중복 체크
            if (msg.type === "MATCH_CONFIRMATION" && msg.agreementId) {
              if (seenAgreementIds.has(msg.agreementId)) {
                console.log(
                  "⚠️ [fetchHistory] 서버 매칭 확인서 agreementId 중복 제거:",
                  msg.agreementId
                );
                return false;
              }
              seenAgreementIds.add(msg.agreementId);
            }

            return true;
          });

          // 서버 메시지의 agreementId Set 생성
          const serverAgreementIds = new Set(
            serverMessages
              .filter((m) => m.agreementId)
              .map((m) => m.agreementId)
          );
          const serverMessageIds = new Set(serverMessages.map((m) => m.id));

          // 클라이언트 메시지 중 서버에 없는 것만 유지
          const uniqueMatchMessages = existingMatchMessages.filter(
            (msg) =>
              !serverMessageIds.has(msg.id) &&
              (!msg.agreementId || !serverAgreementIds.has(msg.agreementId))
          );

          // 서버 메시지와 클라이언트 메시지 병합
          updatedMessages = [...serverMessages];
          uniqueMatchMessages.forEach((clientMsg) => {
            // 서버에 없는 클라이언트 메시지만 추가
            const serverMsg = serverMessages.find(
              (m) =>
                m.agreementId === clientMsg.agreementId &&
                m.type === "MATCH_CONFIRMATION"
            );

            if (!serverMsg) {
              updatedMessages.push(clientMsg);
            }
          });

          // 모든 메시지를 시간순으로 정렬
          updatedMessages.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeA - timeB;
          });
        }

        // 채팅방별 메시지 업데이트
        return {
          messagesByChatroom: {
            ...state.messagesByChatroom,
            [chatroomId]: {
              messages: updatedMessages,
              messageHasNext: data?.hasNext ?? false,
              nextChatId: data?.nextChatId ?? null,
            },
          },
        };
      });
    } catch (error) {
      console.error("과거 메시지 로드 실패:", error);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  clearHistory: (chatroomId?: string) =>
    set((state) => {
      if (chatroomId) {
        // 특정 채팅방의 메시지만 초기화
        const updatedMessagesByChatroom = { ...state.messagesByChatroom };
        delete updatedMessagesByChatroom[chatroomId];
        return {
          messagesByChatroom: updatedMessagesByChatroom,
        };
      } else {
        // chatroomId가 없으면 모든 메시지 초기화
        return {
          messagesByChatroom: {},
          activeRoom: null,
        };
      }
    }),

  addMessage: (message, chatroomId?: string) =>
    set((state) => {
      // chatroomId가 없으면 activeRoom의 chatroomId 사용
      const targetChatroomId = chatroomId || state.activeRoom?.chatroomId;

      if (!targetChatroomId) {
        console.warn(
          "⚠️ [addMessage] chatroomId가 없어 메시지를 추가할 수 없습니다."
        );
        return state;
      }

      const currentChatroomMessages = state.messagesByChatroom[
        targetChatroomId
      ] || {
        messages: [],
        messageHasNext: false,
        nextChatId: null,
      };

      // 중복 체크: 같은 ID나 agreementId를 가진 메시지가 이미 있으면 추가하지 않음
      const existingIds = new Set(
        currentChatroomMessages.messages.map((m) => m.id)
      );
      const existingAgreementIds = new Set(
        currentChatroomMessages.messages
          .filter((m) => m.agreementId)
          .map((m) => m.agreementId)
      );

      // 이미 존재하는 메시지면 추가하지 않음
      if (existingIds.has(message.id)) {
        console.log(
          "⚠️ [addMessage] 중복 메시지 ID 감지, 추가하지 않음:",
          message.id
        );
        return state;
      }

      // MATCH_CONFIRMATION 타입 메시지는 agreementId로도 중복 체크
      if (
        message.type === "MATCH_CONFIRMATION" &&
        message.agreementId &&
        existingAgreementIds.has(message.agreementId)
      ) {
        console.log(
          "⚠️ [addMessage] 중복 매칭 확인서 감지 (agreementId), 추가하지 않음:",
          message.agreementId
        );
        return state;
      }

      console.log("✅ [addMessage] 메시지 추가:", {
        id: message.id,
        type: message.type,
        agreementId: message.agreementId,
        chatroomId: targetChatroomId,
      });

      return {
        messagesByChatroom: {
          ...state.messagesByChatroom,
          [targetChatroomId]: {
            ...currentChatroomMessages,
            messages: [...currentChatroomMessages.messages, message],
          },
        },
      };
    }),
}));
