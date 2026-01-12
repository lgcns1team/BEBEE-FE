import { useParams } from "react-router-dom";
import { confirmAgreement, refuseAgreement } from "../../../api/matchApi";
import type { ChatMessage } from "../types/chat.types";
import { getErrorMessage } from "../../../utils/error";
import { useToastStore } from "../../../store/useToastStore";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../../../store/useUserStore";
import { postApi } from "../../../api/postApi";
interface UseMatchAgreementProps {
  message: ChatMessage;
}

export const useMatchAgreement = ({ message }: UseMatchAgreementProps) => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const { showToast } = useToastStore();
  const { activeRoom } = useChatStore();
  const { user } = useUserStore();

  // agreementId 추출: 최상위에 없으면 matchData에서 가져옴
  const agreementId = message.agreementId || message.matchData?.agreementId;

  // [수락 핸들러]
  const handleAccept = async () => {
    if (!agreementId || !chatroomId || !message.id) {
      alert("필수 정보가 누락되었습니다.");
      return;
    }

    // activeRoom에서 필요한 정보 가져오기
    if (!activeRoom || !activeRoom.postId) {
      alert("채팅방 정보가 없습니다.");
      return;
    }

    // disabledId 결정: 로그인한 사용자의 role에 따라 myId, otherId 배정

    const disabledId = activeRoom.otherId;

    if (!disabledId || !activeRoom) {
      alert("필수 정보가 누락되었습니다.");
      return;
    }

    // 문자열로 변환
    const disabledIdStr = String(disabledId);

    // postId는 activeRoom에서 가져옴
    const postId = message.postId || activeRoom.postId;

    // title은 postDetail에서 가져와야 하는데, API 호출이 필요
    // 일단 임시로 빈 문자열이나 기본값을 사용 (실제로는 postDetail을 가져와야 할 수도 있음)
    let title = message.title || "";

    // title이 없으면 postDetail에서 가져오기
    if (!title && postId) {
      try {
        const postDetail = await postApi.getPostDetail(postId);
        title = postDetail.title;
      } catch (error) {
        console.error("게시글 정보를 가져오는데 실패했습니다:", error);
        // title이 없어도 계속 진행 (서버가 허용하는 경우)
      }
    }

    const requestData = {
      disabledId: disabledIdStr,
      postId: String(postId), // 문자열로 변환
      title: title || "제목 없음", // 빈 문자열 방지
      chatroomId: chatroomId,
      chatId: message.id,
      createdAt: new Date().toISOString(),
    };

    console.log("📤 [매칭확인서 수락] 전송 데이터:", {
      agreementId: agreementId,
      requestData,
      message: message,
      activeRoom: activeRoom,
      user: user,
    });

    try {
      await confirmAgreement(agreementId, requestData);

      // 2. 이후 로직(메시지 추가, 상태 변경 등)은 소켓 수신 시 자동으로 처리됨
      console.log("✅ [매칭확인서 수락] 요청 완료");
    } catch (error) {
      console.error("❌ [매칭확인서 수락] 오류:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as { response?: { data?: unknown } };
        console.error(
          "❌ [매칭확인서 수락] 오류 응답:",
          axiosError.response?.data
        );
      }
      console.error("❌ [매칭확인서 수락] 요청 데이터:", {
        agreementId,
        requestData,
      });
      showToast(
        getErrorMessage(error, "매칭 수락 중 오류가 발생했습니다."),
        "ERROR"
      );
    }
  };

  // [거절 핸들러]
  const handleRefuse = async () => {
    if (!agreementId || !chatroomId || !message.id) return;

    // activeRoom 체크
    if (!activeRoom) {
      console.error("채팅방 정보가 없습니다.");
      return;
    }

    const disabledId = activeRoom.otherId;

    if (!disabledId) {
      console.error("필수 정보가 누락되었습니다.");
      return;
    }

    // 문자열로 변환
    const disabledIdStr = String(disabledId);

    try {
      await refuseAgreement(agreementId, {
        disabledId: disabledIdStr,
        chatroomId: chatroomId,
        chatId: message.id,
        createdAt: new Date().toISOString(),
      });
      console.log("매칭 거절 요청 완료");
    } catch (error) {
      showToast(
        getErrorMessage(error, "매칭 거절 중 오류가 발생했습니다."),
        "ERROR"
      );
    }
  };

  return { handleAccept, handleRefuse };
};
