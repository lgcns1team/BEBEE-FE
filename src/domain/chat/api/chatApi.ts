import axios from "axios";
import type { ChatMessagePayload } from "../chat.types";

// API 응답 타입 정의 (서버가 주는 형태에 따라 다름, 페이징 포함 가정)
interface ChatHistoryResponse {
  content: ChatMessagePayload[]; // 메시지 리스트
  last: boolean; // 마지막 페이지 여부
  pageNumber: number;
}

// 토큰이 필요하므로 인자로 받거나, axios intercepter 설정 필요
export const getChatHistory = async (
  token: string,
  partnerId: number,
  page: number = 0
): Promise<ChatMessagePayload[]> => {
  const response = await axios.get<ChatHistoryResponse>(`/api/chats/history`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      partnerId: partnerId, // 누구와의 대화인가?
      page: page,
      size: 50, // 한 번에 가져올 개수
      sort: "createdAt,desc", // 최신순으로 가져옴 (보통 서버가 해줌)
    },
  });

  // 서버는 보통 최신순(내림차순)으로 줍니다.
  // 하지만 채팅창은 [과거 -> 최신] 순으로 쌓여야 하므로 배열을 뒤집습니다.
  // (만약 서버가 이미 오름차순으로 준다면 .reverse()는 빼세요)
  return response.data.content.reverse();
};
