import { useNavigate } from "react-router-dom";
import { chatApi } from "../api/chatApi";
import type { ChatroomOpenReqDTO } from "../domain/chat/types/chat.types";
import { useChatStore } from "../domain/chat/store/useChatStore";

export const useChatHandler = () => {
  const navigate = useNavigate();
  const { setActiveRoom } = useChatStore();

  const handleChatOpen = async (params: {
    otherMemberId?: string;
    chatroomId?: string;
    postData?: ChatroomOpenReqDTO;
  }) => {
    try {
      const { otherMemberId, chatroomId, postData } = params;

      console.log("🔵 [handleChatOpen] 채팅방 열기 요청:", {
        otherMemberId,
        chatroomId,
        postData,
        isVolunteer: postData?.isVolunteer,
      });

      // API 호출
      const roomInfo = await chatApi.openChatRoom(
        otherMemberId,
        chatroomId,
        postData
      );

      console.log("✅ [handleChatOpen] 채팅방 정보 받음:", {
        요청chatroomId: chatroomId,
        응답chatroomId: roomInfo.chatroomId,
        요청isVolunteer: postData?.isVolunteer,
        응답isVolunteer:
          "isVolunteer" in roomInfo ? roomInfo.isVolunteer : undefined,
        roomInfo,
      });

      // 스토어에 상세 정보 저장
      setActiveRoom(roomInfo);

      // 채팅방 페이지로 이동 (응답의 chatroomId 사용)
      const targetChatroomId = roomInfo.chatroomId;
      console.log("🚀 [handleChatOpen] 채팅방으로 이동:", targetChatroomId);
      navigate(`/chat/${targetChatroomId}`);
    } catch (error) {
      console.error("❌ [handleChatOpen] 채팅방 연결 중 오류 발생:", error);
      alert("채팅방을 불러올 수 없습니다.");
    }
  };

  return { handleChatOpen };
};
