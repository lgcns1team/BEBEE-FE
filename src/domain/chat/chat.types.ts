// 메시지 타입 구분 (일반 텍스트, 이미지, 매칭 확인서, 매칭 성공, 매칭 실패)
export type MessageType = "TEXT" | "IMAGE" | "MATCH_CONFIRMATION" | "MATCH_SUCCESS" | "MATCH_FAIL";
export type MatchStatus = "NON_MATCHED" | "PROCEEDING" | "MATCHED";
export interface ChatMessage {
  id: string;
  senderId: string;
  textContent: string;
  type: string;
  attachments: string[];
  agreementId?: string;
  matchType?: string;
  startDate?: string;
  endDate?: string;
  scheduleDays?: string[];
  scheduleStartTimes?: string[];
  scheduleEndTimes?: string[];
  location?: string;
  unitPoints?: number;
  totalPoints?: number;
  matchStatus?: string;
  createdAt: string;
  chatroomId?: string; // 채팅방 ID (소켓 메시지 구분용)
  postId?: string; // 게시글 ID (매칭 확인서 수락 시 필요)
  title?: string; // 게시글 제목 (매칭 확인서 수락 시 필요)
  helperId?: string; // 도우미 ID (매칭 확인서 수락 시 필요)
  disabledId?: string; // 장애인 ID (매칭 확인서 수락 시 필요)
  isVolunteer?: boolean; // 나눔 여부
  usedHoney?: number; // 사용된 꿀
  currentHoney?: number; // 현재 꿀 잔액
}

export interface ChatMessagesGetResDTO {
  messages: ChatMessage[];
  hasNext: boolean;
  nextChatId: string | null;
}

/** 채팅방 생성/열기 요청 DTO */
export interface ChatroomOpenReqDTO {
  postId?: string;
  postTitle?: string;
  helpCategoryIds?: number[];
}

/** 채팅방 상세 정보 응답 (조회/생성 시) */
export interface ChatroomResponse {
  chatroomId: string;
  myId: string;
  otherId: string;
  otherNickname: string;
  postId: string;
  otherProfileImageUrl: string;
  helpCategories: {
    id: number;
    name: string;
  }[];
  matchStatus: MatchStatus;
}

/** 채팅 목록 내 개별 아이템 */
export interface ChatroomListItem {
  chatroomId: string;
  otherId: string;
  otherNickname: string;
  otherProfileImageUrl: string;
  lastMessage: string;
  updatedAt: string;
  title: string;
}

/** 채팅 목록 조회 응답 (페이징 포함) */
export interface ChatroomListResponse {
  chatrooms: ChatroomListItem[];
  hasNext: boolean;
  nextChatroomId: string | null;
}
