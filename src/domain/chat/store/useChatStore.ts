import { create } from "zustand";
import { chatApi } from "../api/chatApi"; // API 임포트 확인 필요
import type {
  ChatroomResponse,
  ChatroomListItem,
  ChatroomListResponse,
  ChatMessage,
  ChatMessageResponse,
} from "../chat.types";

interface ChatState {
  // 1. 상세 채팅방(룸 정보) 관련
  activeRoom: ChatroomResponse | null;
  setActiveRoom: (room: ChatroomResponse | null) => void;

  // 2. 채팅 목록(List) 관련
  chatrooms: ChatroomListItem[];
  hasNext: boolean;
  nextChatroomId: number | null;
  setChatrooms: (data: ChatroomListResponse, isMore?: boolean) => void;

  // 3. 채팅 메시지 내역(History) 관련
  historyMessages: ChatMessage[];
  messageHasNext: boolean;
  nextChatId: number | null;
  isLoadingHistory: boolean;

  // 과거 내역 조회 액션
  fetchHistory: (
    chatroomId: number,
    lastChatId?: number | null
  ) => Promise<void>;
  // 채팅방 퇴장 시 초기화 액션
  clearHistory: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // 초기값 설정
  activeRoom: null,
  chatrooms: [],
  hasNext: false,
  nextChatroomId: null,

  historyMessages: [],
  messageHasNext: false,
  nextChatId: null,
  isLoadingHistory: false,

  // [액션 1] 상세방 정보 설정
  setActiveRoom: (room) => set({ activeRoom: room }),

  // [액션 2] 채팅 목록 설정 (무한 스크롤 대응)
  setChatrooms: (data, isMore = false) =>
    set((state) => ({
      chatrooms: isMore
        ? [...state.chatrooms, ...data.chatrooms]
        : data.chatrooms,
      hasNext: data.hasNext,
      nextChatroomId: data.nextChatroomId,
    })),

  // [액션 3] 과거 메시지 내역 가져오기
  fetchHistory: async (chatroomId, lastChatId = null) => {
    // 중복 요청 방지
    if (get().isLoadingHistory) return;

    set({ isLoadingHistory: true });
    try {
      // API 호출 (chatApi에 정의된 fetchChatMessages 사용)
      const data: ChatMessageResponse = await chatApi.fetchChatMessages(
        chatroomId,
        lastChatId
      );

      set((state) => ({
        // 최초 조회면 교체, 더보기(lastChatId 존재)면 기존 메시지 '앞'에 추가
        historyMessages: lastChatId
          ? [...data.messages, ...state.historyMessages]
          : data.messages,
        messageHasNext: data.hasNext,
        nextChatId: data.nextChatId,
      }));
    } catch (error) {
      console.error("과거 메시지 로드 실패:", error);
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  // [액션 4] 채팅방 나갈 때 내역 비우기
  clearHistory: () =>
    set({
      historyMessages: [],
      messageHasNext: false,
      nextChatId: null,
      activeRoom: null,
    }),
}));
