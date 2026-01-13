import type { MatchDataResponse } from "./match.types";
export type MessageType =
  | "TEXT"
  | "IMAGE"
  | "MATCH_CONFIRMATION" // 매칭 확인서(제안)
  | "MATCH_SUCCESS" // 매칭 성공(수락됨)
  | "MATCH_FAILURE"; // 매칭 실패(거절됨)

export type MatchStatus = "NON_MATCHED" | "PROCEEDING" | "MATCHED";

export interface ChatMessage {
  // --- 공통 필드 ---
  id: string;
  senderId: string;
  textContent?: string;
  type: MessageType;
  createdAt: string;
  chatroomId?: string;

  // --- 일반 메시지 및 이미지 ---
  attachments?: string[];

  agreementId?: string;
  // --- MATCH_CONFIRMATION(매칭확인서) 전용 필드 ---
  matchData?: MatchDataResponse;

  postId?: string;
  title?: string;
  helperId?: string;
  disabledId?: string;
  isVolunteer?: boolean;
  usedHoney?: number;
  currentHoney?: number;
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
  isVolunteer?: boolean;
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
  isVolunteer?: boolean; // 지원자 목록에서 채팅방 생성 시 전달됨
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
// chat.types.ts 등에 추가
export interface MatchConfirmationData {
  location: string;
  unitPoints: number;
  totalPoints: number;
  startDate?: string;
  endDate?: string;
  scheduleDays?: string[];
  scheduleStartTimes?: string[];
  scheduleEndTimes?: string[];
  // 확인서 수락 시 필요한 게시글 정보들
  postId: string;
  title: string;
  helperId: string;
  disabledId: string;
}
