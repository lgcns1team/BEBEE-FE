// 메시지 타입 (Enum처럼 사용)
export type MessageType = "TEXT" | "IMAGE" | "MATCH_CONFIRMATION";

// 1. 공통 필드
interface BaseMessage {
  receiverId: number; // 받는 사람 ID
  senderId: number; // 보내는 사람 ID
  type: MessageType; // 메시지 종류
  createdAt: string; // "2025-12-11T12:50:58.500"
}

// 2. 텍스트 메시지
export interface TextMessage extends BaseMessage {
  type: "TEXT";
  textContent: string;
}

// 3. 이미지 메시지
export interface ImageMessage extends BaseMessage {
  type: "IMAGE";
  attachments: string[];
}

// 4. 매칭 확인서
export interface MatchConfirmMessage extends BaseMessage {
  type: "MATCH_CONFIRMATION";
  location: string;
  unitPoints: number;
  totalPoints: number;
  startDate: string;
  endDate: string;
  scheduleDays: string[];
  scheduleStartTimes: string[];
  scheduleEndTimes: string[];
}

// 5. 전송용 타입 (Union)
export type ChatMessagePayload =
  | TextMessage
  | ImageMessage
  | MatchConfirmMessage;
