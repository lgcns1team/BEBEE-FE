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

  // 3. 채팅 메시지 내역 관련
  historyMessages: ChatMessage[];
  messageHasNext: boolean;
  nextChatId: string | null; // number -> string | null
  isLoadingHistory: boolean;

  fetchHistory: (
    chatroomId: string,
    lastChatId?: string | null
  ) => Promise<void>;
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeRoom: null,
  chatrooms: [],
  hasNext: false,
  nextChatroomId: null,

  historyMessages: [],
  messageHasNext: false,
  nextChatId: null,
  isLoadingHistory: false,

  setActiveRoom: (room) => set({ activeRoom: room }),

  setChatrooms: (data, isMore = false) =>
    set((state) => ({
      chatrooms: isMore
        ? [...(state.chatrooms ?? []), ...(data?.chatrooms ?? [])]
        : data?.chatrooms ?? [],
      hasNext: data?.hasNext ?? false,
      nextChatroomId: data?.nextChatroomId ?? null,
    })),

  fetchHistory: async (chatroomId, lastChatId = null) => {
    if (get().isLoadingHistory) return;

    set({ isLoadingHistory: true });
    try {
      // API 응답 타입 ChatMessagesGetResDTO 반영
      const data: ChatMessagesGetResDTO = await chatApi.getMessages(
        chatroomId,
        lastChatId
      );

      set((state) => ({
        historyMessages: lastChatId
          ? [...(data?.messages ?? []), ...state.historyMessages]
          : data?.messages ?? [],
        messageHasNext: data?.hasNext ?? false,
        nextChatId: data?.nextChatId ?? null,
      }));
    } catch (error) {
      console.error("과거 메시지 로드 실패:", error);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  clearHistory: () =>
    set({
      historyMessages: [],
      messageHasNext: false,
      nextChatId: null,
      activeRoom: null,
    }),
}));
