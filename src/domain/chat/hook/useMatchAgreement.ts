import { useParams } from "react-router-dom";
import { confirmAgreement, refuseAgreement } from "../../../api/matchApi";
import type { ChatMessage } from "../types/chat.types";
import { getErrorMessage } from "../../../utils/error";
import { useToastStore } from "../../../store/useToastStore";
interface UseMatchAgreementProps {
  message: ChatMessage;
}

export const useMatchAgreement = ({ message }: UseMatchAgreementProps) => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const { showToast } = useToastStore();

  // [수락 핸들러]
  const handleAccept = async () => {
    if (!message.agreementId || !chatroomId)
      return alert("필수 정보가 누락되었습니다.");

    try {
      await confirmAgreement(message.agreementId, {
        disabledId: message.disabledId!,
        postId: message.postId!,
        title: message.title!,
        chatroomId: chatroomId,
      });

      // 2. 이후 로직(메시지 추가, 상태 변경 등)은 소켓 수신 시 자동으로 처리됨
      console.log("매칭 수락 요청 완료");
    } catch (error) {
      showToast(
        getErrorMessage(error, "매칭 수락 중 오류가 발생했습니다."),
        "ERROR"
      );
    }
  };

  // [거절 핸들러]
  const handleRefuse = async () => {
    if (!message.agreementId || !chatroomId) return;

    try {
      await refuseAgreement(message.agreementId, {
        disabledId: message.disabledId!,
        chatroomId: chatroomId,
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
