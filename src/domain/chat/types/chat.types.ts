import type { AgreementRequest } from "./match.types";
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
  textContent: string;
  type: MessageType; // string 대신 MessageType 사용
  createdAt: string;
  chatroomId: string;

  // --- 일반 메시지 및 이미지 ---
  attachments?: string[];

  // --- 매칭 관련 공통 (확인서, 성공, 실패 모두에서 사용 가능) ---
  agreementId?: string; // 매칭 고유 ID
  // --- MATCH_CONFIRMATION(매칭확인서) 전용 필드 ---
  matchData?: AgreementRequest; // 텍스트 메시지에는 없음
  // --- 매칭 결과 및 메타데이터 (필요 시 서버에서 함께 내려줌) ---
  postId?: string;
  title?: string;
  helperId?: string;
  disabledId?: string;
  isVolunteer?: boolean;

  // --- 포인트(꿀) 관련 (성공 시 차감 정보 등) ---
  usedHoney?: number;
  currentHoney?: number;
}

// 나머지 DTO들은 기존과 동일하게 유지하되,
// ChatMessage의 변경 사항이 자동으로 반영됩니다.
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
