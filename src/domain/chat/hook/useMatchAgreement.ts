import { useParams } from "react-router-dom";
import { useChatStore } from "../store/useChatStore";
import { confirmAgreement, refuseAgreement } from "../api/agreementApi";
import type { ChatMessage } from "../chat.types";
import type {
  AgreementConfirmRequest,
  AgreementRefuseRequest,
} from "../agreement.types";

interface UseMatchAgreementProps {
  message: ChatMessage;
  onAcceptSuccess?: (successData: ChatMessage) => void;
  onRefuseSuccess?: () => void;
}

export const useMatchAgreement = ({
  message,
  onAcceptSuccess,
  onRefuseSuccess,
}: UseMatchAgreementProps) => {
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const { getMessageWithMetadata } = useChatStore();

  // 메타데이터가 병합된 메시지 사용
  const messageWithMetadata = getMessageWithMetadata(message);

  const handleAccept = async () => {
    if (!messageWithMetadata.agreementId || !chatroomId) {
      console.error("매칭 확인서 수락 실패: 필수 정보가 없습니다.");
      alert("매칭 확인서 수락에 필요한 정보가 없습니다.");
      return;
    }

    // 매칭 확인서에서 필요한 데이터 확인 (메타데이터 병합된 메시지 사용)
    if (
      !messageWithMetadata.postId ||
      !messageWithMetadata.helperId ||
      !messageWithMetadata.disabledId ||
      !messageWithMetadata.title
    ) {
      console.error(
        "매칭 확인서 수락 실패: 매칭 확인서에 필수 정보가 없습니다.",
        {
          postId: messageWithMetadata.postId,
          helperId: messageWithMetadata.helperId,
          disabledId: messageWithMetadata.disabledId,
          title: messageWithMetadata.title,
          agreementId: messageWithMetadata.agreementId,
        }
      );
      alert("매칭 확인서에 필요한 정보가 없습니다.");
      return;
    }

    try {
      console.log(
        "매칭 확인서 수락 (확인서id):",
        messageWithMetadata.agreementId
      );

      if (!chatroomId) {
        console.error("chatroomId가 없습니다.");
        alert("채팅방 정보가 없습니다.");
        return;
      }

      const confirmRequest: AgreementConfirmRequest = {
        disabledId: messageWithMetadata.disabledId,
        postId: messageWithMetadata.postId,
        title: messageWithMetadata.title,
        chatroomId: chatroomId,
      };

      console.log("🔵 [handleAccept] 수락 요청 데이터:", confirmRequest);

      const response = await confirmAgreement(
        messageWithMetadata.agreementId,
        confirmRequest
      );

      console.log("✅ 매칭 확인서 수락 성공");
      console.log(" 응답 객체:", response);
      console.log(" matchId:", response.matchId);

      // 매칭 성공 데이터 생성 (메타데이터 병합된 메시지 사용)
      const timestamp = new Date().getTime();
      const successData: ChatMessage = {
        id: `match-success-${timestamp}`,
        senderId:
          messageWithMetadata.disabledId || messageWithMetadata.senderId,
        textContent: "매칭이 성사되었습니다.",
        type: "MATCH_SUCCESS",
        attachments: [],
        agreementId: messageWithMetadata.agreementId,
        matchType: messageWithMetadata.matchType,
        startDate: messageWithMetadata.startDate,
        endDate: messageWithMetadata.endDate,
        scheduleDays: messageWithMetadata.scheduleDays,
        scheduleStartTimes: messageWithMetadata.scheduleStartTimes,
        scheduleEndTimes: messageWithMetadata.scheduleEndTimes,
        location: messageWithMetadata.location,
        unitPoints: messageWithMetadata.unitPoints,
        totalPoints: messageWithMetadata.totalPoints,
        createdAt: new Date().toISOString(),
        chatroomId: chatroomId,
        postId: messageWithMetadata.postId,
        title: messageWithMetadata.title,
        helperId: messageWithMetadata.helperId,
        disabledId: messageWithMetadata.disabledId,
      };

      // localStorage에 저장
      localStorage.setItem(
        `bebee-match-success-${chatroomId}`,
        JSON.stringify(successData)
      );

      // 부모 컴포넌트에 알림
      if (onAcceptSuccess) {
        onAcceptSuccess(successData);
      }

      alert("매칭이 성공적으로 수락되었습니다!");
    } catch (error) {
      console.error("❌ 매칭 확인서 수락 실패:", error);

      // 서버 응답 상세 확인
      let errorMessage = "이미 매칭이 완료되었습니다";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string; e?: string };
          };
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data) {
          console.error("서버 응답 데이터:", axiosError.response.data);
        }

        console.error("서버 응답 상태:", axiosError.response?.status);
        console.error("서버 응답 데이터:", axiosError.response?.data);
      } else if (error && typeof error === "object" && "request" in error) {
        console.error("요청은 전송되었지만 응답을 받지 못함:", error.request);
      } else if (error instanceof Error) {
        console.error("요청 설정 중 오류:", error.message);
      }

      alert(errorMessage);
    }
  };

  //매칭 확인서 거절
  const handleRefuse = async () => {
    if (!messageWithMetadata.agreementId || !chatroomId) {
      console.error("매칭 확인서 거절 실패: 필수 정보가 없습니다.");
      alert("매칭 확인서 거절 필수 정보가 누락되었습니다.");
      return;
    }

    // 매칭 확인서에서 필요한 데이터 확인
    if (!messageWithMetadata.disabledId) {
      console.error(
        "매칭 확인서 거절 실패: 매칭 확인서에 필수 정보가 없습니다.",
        {
          disabledId: messageWithMetadata.disabledId,
          agreementId: messageWithMetadata.agreementId,
        }
      );
      alert("매칭 확인서에 필요한 정보가 없습니다.");
      return;
    }

    try {
      console.log("매칭 확인서 거절 시작:", messageWithMetadata.agreementId);
      console.log(
        "🔵 [handleRefuse] chatroomId 확인:",
        chatroomId,
        typeof chatroomId
      );

      const refuseRequest: AgreementRefuseRequest = {
        disabledId: messageWithMetadata.disabledId,
        chatroomId: chatroomId,
      };

      console.log("거절 요청 데이터:", refuseRequest);

      const response = await refuseAgreement(
        messageWithMetadata.agreementId,
        refuseRequest
      );

      console.log("✅ 매칭 확인서 거절 성공");
      console.log("답 객체:", response);

      // 부모 컴포넌트에 알림
      if (onRefuseSuccess) {
        onRefuseSuccess();
      }
    } catch (error) {
      console.error("❌ 매칭 확인서 거절 실패:", error);

      // 서버 응답 상세 확인
      let errorMessage = "이미 매칭이 완료되었습니다.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            status?: number;
            data?: { message?: string; e?: string };
          };
        };

        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        } else if (axiosError.response?.data) {
          console.error("서버 응답 데이터:", axiosError.response.data);
        }

        console.error("서버 응답 상태:", axiosError.response?.status);
        console.error("서버 응답 데이터:", axiosError.response?.data);
      } else if (error && typeof error === "object" && "request" in error) {
        console.error(" 요청은 전송되었지만 응답을 받지 못함:", error.request);
      } else if (error instanceof Error) {
        console.error("요청 설정 중 오류:", error.message);
      }

      alert(errorMessage);
    }
  };

  return {
    handleAccept,
    handleRefuse,
  };
};
