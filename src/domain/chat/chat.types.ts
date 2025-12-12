// 메시지 타입 구분 (일반 텍스트, 이미지, 매칭 확인서)
export type MessageType = "TEXT" | "IMAGE" | "MATCH_CONFIRMATION";

export interface ChatMessage {
  id?: number | string; // 메시지 고유 ID
  senderId?: number; // 보낸 사람 ID (낙관적 업데이트 및 수신 식별용)
  receiverId: number; // 받는 사람 ID
  type: MessageType; // 메시지 타입
  textContent?: string; // 내용 (텍스트일 경우)
  createdAt: string; // 전송 시간 (ISO String)

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
