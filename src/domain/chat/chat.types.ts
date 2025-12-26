// 메시지 타입 구분 (일반 텍스트, 이미지, 매칭 확인서)
export type MessageType = "TEXT" | "IMAGE" | "MATCH_CONFIRMATION";

export interface ChatMessage {
  messageId: number;
  senderId: number;
  content: string;
  createdAt: string;

  // 매칭 확인서용 필드
  location?: string;
  unitPoints?: number;
  totalPoints?: number;
  startDate?: string;
  endDate?: string;
  scheduleDays?: string[];
  scheduleStartTimes?: string[];
  scheduleEndTimes?: string[];
}

export interface ChatMessageResponse {
  messages: ChatMessage[];
  hasNext: boolean;
  nextChatId: number | null;
}

/** 채팅방 생성/열기 요청 DTO */
export interface ChatroomOpenReqDTO {
  postId?: number;
  postTitle?: string;
  helpCategoryIds?: number[];
}

/** 채팅방 상세 정보 응답 (조회/생성 시) */
export interface ChatroomResponse {
  chatroomId: string;
  myId: number;
  otherId: number;
  otherNickname: string;
  otherProfileImageUrl: string;
  otherSweetness: number;
  helpCategories: {
    id: number;
    name: string;
  }[];
}

/** 채팅 목록 내 개별 아이템 */
export interface ChatroomListItem {
  chatroomId: string;
  otherId: number;
  otherNickname: string;
  otherProfileImageUrl: string;
  otherSweetness: number;
  updatedAt: string;
  title: string;
}

/** 채팅 목록 조회 응답 (페이징 포함) */
export interface ChatroomListResponse {
  chatrooms: ChatroomListItem[];
  hasNext: boolean;
  nextChatroomId: number | null;
}
