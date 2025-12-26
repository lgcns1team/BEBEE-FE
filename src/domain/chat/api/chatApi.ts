import axios from "axios";
import type {
  ChatroomOpenReqDTO,
  ChatroomResponse,
  ChatroomListResponse,
  ChatMessageResponse,
} from "../chat.types";

const SERVER_URL = "https://bebee-chat-1036667053569.asia-northeast3.run.app";

export const chatApi = {
  /**
   * 채팅방 열기 (조회/생성)
   * axios.post(URL, data, config) 순서로 인자를 전달합니다.
   */
  openChatRoom: async (
    currentMemberId: number,
    otherMemberId?: number,
    chatroomId?: string,
    body?: ChatroomOpenReqDTO
  ): Promise<ChatroomResponse> => {
    const response = await axios.post<ChatroomResponse>(
      `${SERVER_URL}/chatrooms`,
      body || {}, // 2번째 인자: Request Body (게시글 정보)
      {
        // 3번째 인자: Config (쿼리 파라미터 및 헤더)
        params: {
          currentMemberId,
          otherMemberId,
          chatroomId,
        },
        headers: {
          "Content-Type": "application/json",
          // 필요 시 토큰 추가
        },
      }
    );
    return response.data;
  },
  /**
   * 채팅방 목록 조회 (커서 기반 페이징)
   */
  getChatRoomList: async (
    currentMemberId: number,
    lastChatroomId?: number
  ): Promise<ChatroomListResponse> => {
    const response = await axios.get<ChatroomListResponse>(
      `${SERVER_URL}/chatrooms/list`,
      {
        params: {
          currentMemberId,
          lastChatroomId,
        },
      }
    );

    return response.data;
  },

  fetchChatMessages: async (
    chatroomId: number,
    lastChatId?: number | null,
    count: number = 20
  ): Promise<ChatMessageResponse> => {
    const response = await axios.get<ChatMessageResponse>(
      `${SERVER_URL}/chatrooms/chats`,
      {
        params: {
          chatroomId,
          lastChatId: lastChatId || undefined,
          count,
        },
      }
    );
    return response.data;
  },
};
