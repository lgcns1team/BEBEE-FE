import { instance } from "./axiosInstance";

import type {
  ChatroomOpenReqDTO,
  ChatroomResponse,
  ChatroomListResponse,
  ChatMessagesGetResDTO,
} from "../domain/chat/types/chat.types";
// chat instance

export const chatApi = {
  /**
   * 채팅방 열기 (조회/생성)
   */
  openChatRoom: async (
    otherMemberId?: string,
    chatroomId?: string,
    body?: ChatroomOpenReqDTO
  ): Promise<ChatroomResponse> => {
    const response = await instance.post<ChatroomResponse>(
      "chat/chatrooms",
      body || {}, // 2번째 인자: Request Body (게시글 정보)
      {
        params: {
          otherMemberId,
          chatroomId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseData = response.data;

    return responseData;
  },

  /**
   * 채팅방 생성 (새로운 채팅방 생성)
   * @param otherMemberId 상대방 멤버 ID (쿼리 파라미터)
   * @param body 게시글 정보 (postId, postTitle, helpCategoryIds)
   */
  createChatRoom: async (
    otherMemberId: string,
    body: ChatroomOpenReqDTO
  ): Promise<ChatroomResponse> => {
    const response = await instance.post<ChatroomResponse>(
      "chat/chatrooms",
      body,
      {
        params: {
          otherMemberId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = response.data;
    console.log("[chatApi.createChatRoom] 채팅방 생성 응답:", {
      전체응답: responseData,
      isVolunteer:
        "isVolunteer" in responseData ? responseData.isVolunteer : undefined,
      전달한body: body,
    });
    return response.data;
  },

  /**
   * 채팅방 목록 조회 (커서 기반 페이징)
   * @param lastChatroomId 마지막으로 조회한 채팅방 ID (커서 페이징용)
   * @param count 한 번에 조회할 채팅방 개수 (기본값: 20)
   */
  getChatRoomList: async (
    lastChatroomId?: string | null,
    count: number = 20
  ): Promise<ChatroomListResponse> => {
    const params: {
      lastChatroomId?: string | null;
      count?: number;
    } = {};

    // lastChatroomId가 있으면 포함 (null이어도 명시적으로 전달하지 않음)
    if (lastChatroomId !== undefined && lastChatroomId !== null) {
      params.lastChatroomId = lastChatroomId;
    }

    // count는 기본값 20이지만 명시적으로 전달
    params.count = count;

    const response = await instance.get<ChatroomListResponse>(
      "chat/chatrooms/list",
      {
        params,
      }
    );

    return response.data;
  },

  getMessages: async (
    chatroomId: string,
    lastChatId?: string | null,
    count: number = 20
  ) => {
    try {
      const params: {
        chatroomId: string;
        lastChatId?: string | null;
        count?: number;
      } = {
        chatroomId,
        count,
      };

      // lastChatId가 있으면 포함 (null이어도 명시적으로 전달하지 않음)
      if (lastChatId !== undefined && lastChatId !== null) {
        params.lastChatId = lastChatId;
      }

      const response = await instance.get<ChatMessagesGetResDTO>(
        "chat/chatrooms/chats",
        {
          params,
          headers: {
            accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("메시지 로드 실패:", error);
      throw error;
    }
  },
};
