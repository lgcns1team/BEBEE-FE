import { create } from "zustand";
import { chatApi } from "../../../api/chatApi";
import type {
  ChatroomResponse,
  ChatroomListItem,
  ChatroomListResponse,
  ChatMessage,
  MatchStatus,
} from "../types/chat.types";

// 소켓/API에서 받은 UTC 기반 시간을 KST 오프셋(+09:00) 문자열로 변환
const toKstOffsetString = (dateStr: string) => {
  if (!dateStr) return dateStr;

  // 서버가 타임존 정보 없이 UTC 시각을 내려주는 경우를 대비해, Z가 없으면 UTC로 가정
  const hasTz = /[zZ]|[+-]\d\d:\d\d$/.test(dateStr);
  const utcAssumed = hasTz ? dateStr : `${dateStr}Z`;

  const formatter = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const formatted = formatter.format(new Date(utcAssumed)); // e.g. "2026-01-15 15:40:32"
  return `${formatted.replace(" ", "T")}+09:00`; // ISO 파싱 가능한 형태
};

const normalizeMessageToKst = (message: ChatMessage): ChatMessage => ({
  ...message,
  createdAt: toKstOffsetString(message.createdAt),
});

interface ChatState {
  // 1. 상세 채팅방 관련
  activeRoom: ChatroomResponse | null;
  setActiveRoom: (room: ChatroomResponse | null) => void;

  // 2. 채팅 목록 관련
  chatrooms: ChatroomListItem[];
  hasNext: boolean;
  nextChatroomId: string | null;
  setChatrooms: (data: ChatroomListResponse, isMore?: boolean) => void;

  // 3. 채팅 메시지 내역 (채팅방 ID를 키로 관리)
  messagesByChatroom: Record<
    string,
    {
      messages: ChatMessage[];
      hasNext: boolean;
      lastChatId: string | null;
    }
  >;

  isLoadingHistory: boolean;

  // 헬퍼 함수들
  getMessages: (chatroomId?: string) => ChatMessage[];
  fetchHistory: (
    chatroomId: string,
    isfFirstLoad?: boolean | null
  ) => Promise<void>;
  updateMatchStatus: (status: MatchStatus) => void;
  addMessage: (message: ChatMessage, chatroomId?: string) => void;
  clearHistory: (chatroomId?: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  activeRoom: null,
  chatrooms: [],
  hasNext: false,
  nextChatroomId: null,
  messagesByChatroom: {},
  isLoadingHistory: false,

  // 현재 방의 메시지 리스트 가져오기
  getMessages: (chatroomId) => {
    const id = chatroomId || get().activeRoom?.chatroomId;
    return id ? get().messagesByChatroom[id]?.messages || [] : [];
  },

  setActiveRoom: (room) => set({ activeRoom: room }),
  // useChatStore.ts 내부
  updateMatchStatus: (status: MatchStatus) =>
    set((state) => ({
      activeRoom: state.activeRoom
        ? { ...state.activeRoom, matchStatus: status }
        : null,
    })),
  // 채팅 목록 업데이트 (메인 화면용)
  setChatrooms: (data, isMore = false) =>
    set((state) => ({
      chatrooms: isMore
        ? [...state.chatrooms, ...data.chatrooms]
        : data.chatrooms,
      hasNext: data.hasNext,
      nextChatroomId: data.nextChatroomId,
    })),

  // 메시지 내역 불러오기 (GET API)
  // 메시지 내역 불러오기 (GET API)
  fetchHistory: async (chatroomId: string, isFirstLoad = false) => {
    // 로딩 중이면 중복 요청 방지
    if (get().isLoadingHistory) {
      console.log("이미 메시지 로딩 중, 요청 스킵");
      return;
    }

    const roomState = get().messagesByChatroom[chatroomId] || {
      messages: [],
      hasNext: true,
      lastChatId: null,
    };

    if (!isFirstLoad && !roomState.hasNext) return;

    // 첫 로딩이면 null, 아니면 저장해둔 lastChatId(서버의 nextChatId) 사용
    const cursor = isFirstLoad ? null : roomState.lastChatId;

    try {
      set({ isLoadingHistory: true });
      const data = await chatApi.getMessages(chatroomId, cursor);

      // 첫 로딩 시에만 검증 (스크롤로 더 불러오기 시에는 검증하지 않음)
      // 검증을 너무 엄격하게 하면 정상적인 경우에도 무시될 수 있으므로 주의

      set((state) => {
        const prevRoomData = state.messagesByChatroom[chatroomId] || {
          messages: [],
        };

        return {
          isLoadingHistory: false,
          messagesByChatroom: {
            ...state.messagesByChatroom,
            [chatroomId]: {
              // 1. data.chats 대신 data.messages 사용
              messages: isFirstLoad
                ? data.messages.map(normalizeMessageToKst)
                : [
                    ...data.messages.map(normalizeMessageToKst),
                    ...prevRoomData.messages,
                  ],

              // 2. 서버의 다음 페이지 유무 반영
              hasNext: data.hasNext,

              // 3. 서버에서 준 차기 조회용 ID(nextChatId)를 스토어의 lastChatId에 저장
              lastChatId: data.nextChatId,
            },
          },
        };
      });
    } catch (error) {
      set({ isLoadingHistory: false });
      console.error(`${chatroomId} 내역 로드 실패:`, error);
    }
  },
  // 메시지 한 개 추가 (소켓 수신 시 호출)
  addMessage: (message, chatroomId) =>
    set((state) => {
      const normalizedMessage = normalizeMessageToKst(message);

      // 1. 타겟 채팅방 ID 결정 (전달된 ID가 없으면 현재 활성화된 방 사용)
      const targetId = chatroomId || state.activeRoom?.chatroomId;
      if (!targetId) return state;

      // 2. 해당 방의 기존 데이터 가져오기 (만약 처음 받는 메시지라면 초기 객체 생성)
      const currentRoomData = state.messagesByChatroom[targetId] || {
        messages: [],
        hasNext: true,
        lastChatId: null,
      };

      // 3. [중요] 중복 메시지 방지
      // 소켓은 네트워크 상황에 따라 같은 메시지가 두 번 올 수 있으므로 ID로 체크합니다.
      const isDuplicate = currentRoomData.messages.some(
        (m) => m.id === normalizedMessage.id
      );
      if (isDuplicate) {
        console.log("⚠️ [useChatStore] 중복 메시지 무시:", {
          messageId: message.id,
          textContent: message.textContent,
          chatroomId: targetId,
        });
        return state;
      }

      // 4. 상태 업데이트
      return {
        messagesByChatroom: {
          ...state.messagesByChatroom,
          [targetId]: {
            ...currentRoomData,
            messages: [...currentRoomData.messages, normalizedMessage],
          },
        },
      };
    }),
  // 기록 초기화
  clearHistory: (chatroomId) =>
    set((state) => {
      if (chatroomId) {
        const { [chatroomId]: _, ...rest } = state.messagesByChatroom;
        return { messagesByChatroom: rest };
      }
      return { messagesByChatroom: {}, activeRoom: null };
    }),
}));
