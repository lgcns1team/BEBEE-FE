import { useNavigate } from "react-router-dom";
import { chatApi } from "../domain/chat/api/chatApi";
import type { ChatroomOpenReqDTO } from "../domain/chat/chat.types";
import { useChatStore } from "../domain/chat/store/useChatStore";

export const useChatHandler = () => {
  const navigate = useNavigate();
  const { setActiveRoom } = useChatStore();

  const handleChatOpen = async (
    currentMemberId: number,
    params: {
      otherMemberId?: number;
      chatroomId?: string;
      postData?: ChatroomOpenReqDTO;
    }
  ) => {
    try {
      const { otherMemberId, chatroomId, postData } = params;

      // API 호출
      const roomInfo = await chatApi.openChatRoom(
        currentMemberId,
        otherMemberId,
        chatroomId,
        postData
      );

      // 스토어에 상세 정보 저장
      setActiveRoom(roomInfo);

      // 채팅방 페이지로 이동
      navigate(`/chat/${roomInfo.chatroomId}`);
    } catch (error) {
      console.error("채팅방 연결 중 오류 발생:", error);
      alert("채팅방을 불러올 수 없습니다.");
    }
  };

  return { handleChatOpen };
};
