import { create } from "zustand";
import { chatApi } from "../../../api/chatApi";
import type {
  ChatroomResponse,
  ChatroomListItem,
  ChatroomListResponse,
  ChatMessage,
  ChatMessagesGetResDTO,
} from "../chat.types";

import type { AgreementMetadata } from "../agreement.types";
// localStorage 키
const STORAGE_KEY = "bebee-chat-messages";
const AGREEMENT_METADATA_KEY = "bebee-agreement-metadata";

// 매칭 확인서 메타데이터 타입

// localStorage에서 메시지 복원
const loadMessagesFromStorage = (): Record<
  string,
  {
    messages: ChatMessage[];
    messageHasNext: boolean;
    nextChatId: string | null;
  }
> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // 데이터 구조 검증
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
        localStorage.removeItem(STORAGE_KEY);
        return {};
      }

      // 각 room의 구조 검증 및 정리
      const validated: Record<
        string,
        {
          messages: ChatMessage[];
          messageHasNext: boolean;
          nextChatId: string | null;
        }
      > = {};

      Object.keys(parsed).forEach((key) => {
        const room = parsed[key];
        if (room && typeof room === "object" && !Array.isArray(room)) {
          // messages가 배열인지 확인
          const messages = Array.isArray(room.messages) ? room.messages : [];
          validated[key] = {
            messages,
            messageHasNext: Boolean(room.messageHasNext),
            nextChatId: room.nextChatId || null,
          };
        }
      });

      return validated;
    }
  } catch (error) {
    console.error("복원 실패:", error);
    // 오류 발생 시 localStorage 초기화
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("localStorage 초기화 실패:", e);
    }
  }
  console.log("localStorage에 저장된 메시지 없음");
  return {};
};

// localStorage에서 매칭 확인서 메타데이터 복원
const loadAgreementMetadataFromStorage = (): Record<
  string,
  AgreementMetadata
> => {
  try {
    const stored = localStorage.getItem(AGREEMENT_METADATA_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Record<string, AgreementMetadata>;
      const metadataCount = Object.keys(parsed).length;
      console.log(
        `✅ [loadAgreementMetadataFromStorage] localStorage에서 메타데이터 복원:`,
        {
          메타데이터수: metadataCount,
        }
      );
      return parsed;
    }
  } catch (error) {
    console.error(" localStorage에서 메타데이터 복원 실패:", error);
  }

  return {};
};

// localStorage에 매칭 확인서 메타데이터 저장
const saveAgreementMetadataToStorage = (
  metadata: Record<string, AgreementMetadata>
) => {
  try {
    const metadataCount = Object.keys(metadata).length;
    localStorage.setItem(AGREEMENT_METADATA_KEY, JSON.stringify(metadata));
    console.log(`localStorage에 메타데이터 저장:`, {
      메타데이터수: metadataCount,
    });
  } catch (error) {
    console.error("localStorage에 메타데이터 저장 실패:", error);
  }
};

// localStorage에 메시지 저장
const saveMessagesToStorage = (
  messagesByChatroom: Record<
    string,
    {
      messages: ChatMessage[];
      messageHasNext: boolean;
      nextChatId: string | null;
    }
  >
) => {
  try {
    if (
      !messagesByChatroom ||
      typeof messagesByChatroom !== "object" ||
      Array.isArray(messagesByChatroom)
    ) {
      console.warn("메시지 데이터 형식이 올바르지 않음");
      return;
    }

    // 안전한 접근을 위한 검증 및 정리
    const validated: Record<
      string,
      {
        messages: ChatMessage[];
        messageHasNext: boolean;
        nextChatId: string | null;
      }
    > = {};

    Object.keys(messagesByChatroom).forEach((key) => {
      const room = messagesByChatroom[key];
      if (room && typeof room === "object" && !Array.isArray(room)) {
        validated[key] = {
          messages: Array.isArray(room.messages) ? room.messages : [],
          messageHasNext: Boolean(room.messageHasNext),
          nextChatId: room.nextChatId || null,
        };
      }
    });

    const chatroomCount = Object.keys(validated).length;
    const totalMessages = Object.values(validated).reduce(
      (sum, room) =>
        sum + (Array.isArray(room.messages) ? room.messages.length : 0),
      0
    );

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
    console.log(`💾 localStorage에 메시지 저장:`, {
      채팅방수: chatroomCount,
      총메시지수: totalMessages,
    });
  } catch (error) {
    console.error("메시지 저장 실패:", error);
  }
};

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

  // 4. 매칭 확인서 메타데이터 (agreementId를 키로 관리)
  agreementMetadata: Record<string, AgreementMetadata>;

  isLoadingHistory: boolean;

  // 현재 활성 채팅방의 메시지 조회 헬퍼
  getHistoryMessages: (chatroomId?: string) => ChatMessage[];
  getMessageHasNext: (chatroomId?: string) => boolean;
  getNextChatId: (chatroomId?: string) => string | null;

  // 매칭 확인서 메타데이터 관리
  setAgreementMetadata: (
    agreementId: string,
    metadata: AgreementMetadata
  ) => void;
  getAgreementMetadata: (agreementId: string) => AgreementMetadata | undefined;
  // 메시지에 메타데이터 병합
  getMessageWithMetadata: (message: ChatMessage) => ChatMessage;

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

  messagesByChatroom: loadMessagesFromStorage(), // localStorage에서 복원
  agreementMetadata: loadAgreementMetadataFromStorage(), // localStorage에서 복원
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

  // 매칭 확인서 메타데이터 설정
  setAgreementMetadata: (agreementId: string, metadata: AgreementMetadata) => {
    set((state) => {
      const updatedMetadata = {
        ...state.agreementMetadata,
        [agreementId]: metadata,
      };
      saveAgreementMetadataToStorage(updatedMetadata);
      return { agreementMetadata: updatedMetadata };
    });
  },

  // 매칭 확인서 메타데이터 조회
  getAgreementMetadata: (agreementId: string) => {
    return get().agreementMetadata[agreementId];
  },

  // 메시지에 메타데이터 병합
  getMessageWithMetadata: (message: ChatMessage) => {
    if (message.type === "MATCH_CONFIRMATION" && message.agreementId) {
      const metadata = get().agreementMetadata[message.agreementId];
      if (metadata) {
        return {
          ...message,
          postId: message.postId || metadata.postId,
          title: message.title || metadata.title,
          helperId: message.helperId || metadata.helperId,
          disabledId: message.disabledId || metadata.disabledId,
        };
      }
    }
    return message;
  },

  setActiveRoom: (room) => set({ activeRoom: room }),

  setChatrooms: (data, isMore = false) =>
    set((state) => {
      // 안전한 배열 처리: undefined/null이거나 배열이 아니면 빈 배열로 처리
      // Array.isArray(undefined) = false → [] 반환
      // Array.isArray(null) = false → [] 반환
      // Array.isArray([]) = true → 원본 배열 반환
      const safeExistingChatrooms = Array.isArray(state.chatrooms)
        ? state.chatrooms
        : [];
      const safeNewChatrooms = Array.isArray(data?.chatrooms)
        ? data.chatrooms
        : [];

      if (isMore) {
        // 중복 제거: 기존 chatroomId를 Set으로 관리하여 중복 방지
        const existingIds = new Set(
          safeExistingChatrooms.map((room) => room?.chatroomId).filter(Boolean)
        );
        const newRooms = safeNewChatrooms.filter(
          (room) => room?.chatroomId && !existingIds.has(room.chatroomId)
        );
        return {
          chatrooms: [...safeExistingChatrooms, ...newRooms],
          hasNext: data?.hasNext ?? false,
          nextChatroomId: data?.nextChatroomId ?? null,
        };
      }
      return {
        chatrooms: safeNewChatrooms,
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
        // 현재 채팅방의 메시지 가져오기 (localStorage에서 복원된 메시지 포함)
        const currentChatroomMessages = state.messagesByChatroom[
          chatroomId
        ] || {
          messages: [],
          messageHasNext: false,
          nextChatId: null,
        };

        // 안전한 접근 보장
        const safeMessages = Array.isArray(currentChatroomMessages.messages)
          ? currentChatroomMessages.messages
          : [];

        console.log(`🔍 [fetchHistory] 현재 상태 확인:`, {
          chatroomId,
          기존메시지개수: safeMessages.length,
          전체채팅방수: state.messagesByChatroom
            ? Object.keys(state.messagesByChatroom).length
            : 0,
        });

        let updatedMessages: ChatMessage[];

        // lastChatId가 null이면 초기 로드: 서버 메시지와 기존 메시지 병합
        // lastChatId가 있으면 이전 메시지 로드: 기존 메시지 앞에 추가
        if (lastChatId) {
          // 이전 메시지 로드: 기존 메시지 앞에 추가
          const safeExistingMessages = Array.isArray(
            currentChatroomMessages.messages
          )
            ? currentChatroomMessages.messages
            : [];
          const safeServerMessages = Array.isArray(data?.messages)
            ? data.messages
            : [];
          updatedMessages = [...safeServerMessages, ...safeExistingMessages];
        } else {
          // 초기 로드 시: 서버 메시지와 기존 메시지(로컬 저장소에서 복원된 메시지 포함) 병합
          // localStorage에서 복원된 모든 메시지를 유지
          const existingMessages = Array.isArray(
            currentChatroomMessages.messages
          )
            ? currentChatroomMessages.messages
            : [];
          console.log(
            `📥 [fetchHistory] 초기 로드 - 기존 메시지 개수: ${existingMessages.length}`,
            {
              chatroomId,
              existingCount: existingMessages.length,
              serverCount: data?.messages?.length || 0,
            }
          );

          let serverMessages = Array.isArray(data?.messages)
            ? data.messages
            : [];

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

          // 서버 메시지의 ID와 agreementId Set 생성
          const serverAgreementIds = new Set(
            serverMessages
              .filter((m) => m.agreementId)
              .map((m) => m.agreementId)
          );
          const serverMessageIds = new Set(serverMessages.map((m) => m.id));

          // 기존 메시지(localStorage에서 복원된 메시지 포함) 중 서버에 없는 것만 유지
          const uniqueExistingMessages = existingMessages.filter((msg) => {
            // 서버에 이미 있는 메시지는 제외
            if (serverMessageIds.has(msg.id)) {
              return false;
            }
            // MATCH_CONFIRMATION 타입은 agreementId로도 체크
            if (
              msg.type === "MATCH_CONFIRMATION" &&
              msg.agreementId &&
              serverAgreementIds.has(msg.agreementId)
            ) {
              return false;
            }
            return true;
          });

          // 서버 메시지에 메타데이터 병합
          const serverMessagesWithMetadata = serverMessages.map((msg) => {
            if (msg.type === "MATCH_CONFIRMATION" && msg.agreementId) {
              const metadata = state.agreementMetadata[msg.agreementId];
              if (metadata) {
                return {
                  ...msg,
                  postId: msg.postId || metadata.postId,
                  title: msg.title || metadata.title,
                  helperId: msg.helperId || metadata.helperId,
                  disabledId: msg.disabledId || metadata.disabledId,
                };
              }
            }
            return msg;
          });

          // 서버 메시지와 기존 메시지 병합 (시간순 정렬)
          updatedMessages = [
            ...serverMessagesWithMetadata,
            ...uniqueExistingMessages,
          ];

          console.log(`✅ [fetchHistory] 메시지 병합 완료:`, {
            chatroomId,
            서버메시지: serverMessages.length,
            기존메시지유지: uniqueExistingMessages.length,
            최종메시지: updatedMessages.length,
          });

          // 모든 메시지를 시간순으로 정렬
          updatedMessages.sort((a, b) => {
            const timeA = new Date(a.createdAt).getTime();
            const timeB = new Date(b.createdAt).getTime();
            return timeA - timeB;
          });
        }

        // 채팅방별 메시지 업데이트 (다른 채팅방의 메시지는 유지)
        const updatedMessagesByChatroom = {
          ...state.messagesByChatroom, // 기존 모든 채팅방 메시지 유지
          [chatroomId]: {
            messages: updatedMessages,
            messageHasNext: data?.hasNext ?? false,
            nextChatId: data?.nextChatId ?? null,
          },
        };

        console.log(
          `💾 [fetchHistory] localStorage 저장 전 - 채팅방 수: ${
            Object.keys(updatedMessagesByChatroom).length
          }`
        );

        // localStorage에 저장 (모든 채팅방 메시지 포함)
        saveMessagesToStorage(updatedMessagesByChatroom);

        return {
          messagesByChatroom: updatedMessagesByChatroom,
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
      let updatedMessagesByChatroom: Record<
        string,
        {
          messages: ChatMessage[];
          messageHasNext: boolean;
          nextChatId: string | null;
        }
      >;
      let updatedMetadata = { ...state.agreementMetadata };

      if (chatroomId) {
        // 특정 채팅방의 메시지만 초기화
        updatedMessagesByChatroom = { ...state.messagesByChatroom };
        delete updatedMessagesByChatroom[chatroomId];

        // 해당 채팅방의 매칭 확인서 메타데이터도 제거
        Object.keys(updatedMetadata).forEach((agreementId) => {
          if (updatedMetadata[agreementId].chatroomId === chatroomId) {
            delete updatedMetadata[agreementId];
          }
        });
      } else {
        // chatroomId가 없으면 모든 메시지 초기화
        updatedMessagesByChatroom = {};
        updatedMetadata = {};
      }

      // localStorage에 저장
      saveMessagesToStorage(updatedMessagesByChatroom);
      saveAgreementMetadataToStorage(updatedMetadata);

      return {
        messagesByChatroom: updatedMessagesByChatroom,
        agreementMetadata: updatedMetadata,
        ...(chatroomId ? {} : { activeRoom: null }),
      };
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

      // 안전한 접근 보장
      const safeMessages = Array.isArray(currentChatroomMessages.messages)
        ? currentChatroomMessages.messages
        : [];

      // 중복 체크: 같은 ID나 agreementId를 가진 메시지가 이미 있으면 추가하지 않음
      const existingIds = new Set(
        safeMessages.map((m) => m?.id).filter(Boolean)
      );
      const existingAgreementIds = new Set(
        safeMessages
          .filter((m) => m?.agreementId)
          .map((m) => m.agreementId)
          .filter(Boolean)
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

      // MATCH_CONFIRMATION 타입 메시지이고 메타데이터가 있으면 저장
      if (
        message.type === "MATCH_CONFIRMATION" &&
        message.agreementId &&
        message.postId &&
        message.helperId &&
        message.disabledId &&
        message.title
      ) {
        const metadata: AgreementMetadata = {
          postId: message.postId,
          title: message.title,
          helperId: message.helperId,
          disabledId: message.disabledId,
          chatroomId: targetChatroomId,
          agreementId: message.agreementId,
        };
        const updatedMetadata = {
          ...state.agreementMetadata,
          [message.agreementId]: metadata,
        };
        saveAgreementMetadataToStorage(updatedMetadata);
        set({ agreementMetadata: updatedMetadata });
      }

      const updatedMessagesByChatroom = {
        ...(state.messagesByChatroom || {}),
        [targetChatroomId]: {
          ...currentChatroomMessages,
          messages: [...safeMessages, message],
        },
      };

      // localStorage에 저장
      saveMessagesToStorage(updatedMessagesByChatroom);

      return {
        messagesByChatroom: updatedMessagesByChatroom,
      };
    }),
}));
