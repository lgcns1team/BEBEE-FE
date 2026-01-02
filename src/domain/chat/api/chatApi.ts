//import { instance } from "../../../api/axiosInstance";
import axios from "axios";
import type {
  ChatroomOpenReqDTO,
  ChatroomResponse,
  ChatroomListResponse,
  ChatMessagesGetResDTO,
} from "../chat.types";
// chat instance
const chatInstance = axios.create({
  baseURL: "https://bebee-chat-1036667053569.asia-northeast3.run.app",
  headers: {
    "Content-Type": "application/json",
  },
});
export const chatApi = {
  /**
   * 채팅방 열기 (조회/생성)
   * axios.post(URL, data, config) 순서로 인자를 전달합니다.
   */
  openChatRoom: async (
    currentMemberId: string,
    otherMemberId?: string,
    chatroomId?: string,
    body?: ChatroomOpenReqDTO
  ): Promise<ChatroomResponse> => {
    const response = await chatInstance.post<ChatroomResponse>(
      "/chatrooms",
      body || {}, // 2번째 인자: Request Body (게시글 정보)
      {
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
    currentMemberId: string,
    lastChatroomId?: string | null
  ): Promise<ChatroomListResponse> => {
    const response = await chatInstance.get<ChatroomListResponse>(
      "chatrooms/list",
      {
        params: {
          currentMemberId,
          lastChatroomId,
        },
      }
    );

    return response.data;
  },

  getMessages: async (
    chatroomId: string,
    nextChatId?: string | null,
    count: number = 20
  ) => {
    try {
      const response = await chatInstance.get<ChatMessagesGetResDTO>(
        "/chatrooms/chats",
        {
          params: {
            chatroomId,
            nextChatId,
            count,
          },
          headers: {
            accept: "application/json",
          },
        }
      );

      // axios는 서버 응답 데이터를 .data에 담아서 반환합니다.
      return response.data;
    } catch (error) {
      // axios는 4xx, 5xx 에러 발생 시 자동으로 catch 문으로 넘어옵니다.
      console.error("메시지 로드 실패:", error);
      throw error;
    }
  },
};
