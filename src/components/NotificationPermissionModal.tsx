import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { IoClose } from "react-icons/io5";
import { useNotificationPermissionStore } from "../store/useNotificationPermissionStore";
import {
  initializeFCM,
  setupFCMMessageListener,
} from "../hooks/useFirebaseHandler";
import { registerFCMToken } from "../api/notificationApi";
import { useUserStore } from "../store/useUserStore";
import { useToastStore } from "../store/useToastStore";

// 모바일 기기 감지 유틸리티
const detectDeviceType = (): "WEB_PC" | "WEB_MOBILE" => {
  if (typeof window === "undefined") return "WEB_PC";
  const userAgent = navigator.userAgent || navigator.vendor || "";
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );
  return isMobile ? "WEB_MOBILE" : "WEB_PC";
};

export const NotificationPermissionModal = () => {
  const { isModalOpen, hideModal } = useNotificationPermissionStore();
  const { user } = useUserStore();
  const { showToast } = useToastStore();

  // ESC 키로 닫기
  useEffect(() => {
    if (!isModalOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        hideModal();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isModalOpen, hideModal]);

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isModalOpen) return null;

  // 알림 받기 버튼 클릭 핸들러
  const handleAllowNotification = async () => {
    // 로그인하지 않은 경우
    if (!user) {
      showToast("로그인이 필요합니다.", "ERROR");
      hideModal();
      return;
    }

    // 브라우저 지원 확인
    if (typeof window === "undefined" || !("Notification" in window)) {
      showToast("이 브라우저는 알림을 지원하지 않습니다.", "ERROR");
      hideModal();
      return;
    }

    // 이미 권한이 있는 경우
    if (Notification.permission === "granted") {
      showToast("알림 권한이 이미 허용되어 있습니다.", "SUCCESS");
      hideModal();
      return;
    }

    try {
      // 1. 클릭하자마자 권한부터 요청 (iOS 제스처 유효 시간 확보)
      let permission: NotificationPermission;
      try {
        permission = await Notification.requestPermission();
        console.log("🔔 [알림 모달] 권한 요청 결과:", permission);
      } catch (error) {
        console.error("❌ [FCM] 알림 권한 요청 오류:", error);
        showToast("알림 권한 요청 중 오류가 발생했습니다.", "ERROR");
        hideModal();
        return;
      }

      // 권한이 허용되지 않은 경우
      if (permission !== "granted") {
        if (permission === "denied") {
          showToast("알림 권한이 거부되었습니다.", "ERROR");
        } else {
          showToast("알림 권한 요청에 실패했습니다.", "ERROR");
        }
        hideModal();
        return;
      }

      // 2. 권한이 허용된 "후에" 서비스 워커 등록 및 토큰 발행 진행
      // 내부 권한 요청은 false로 설정 (이미 위에서 요청했으므로)
      const token = await initializeFCM(false);

      if (token) {
        // 서버에 토큰 등록
        try {
          const deviceType = detectDeviceType();
          await registerFCMToken(token, deviceType);
          showToast("알림 권한이 허용되었습니다!", "SUCCESS");

          // 포그라운드 메시지 리스너 설정
          setupFCMMessageListener();

          // 성공 시 모달 닫기
          hideModal();
        } catch (error) {
          console.error("❌ [FCM] 토큰 서버 등록 실패:", error);
          showToast("토큰 등록에 실패했습니다.", "ERROR");
          hideModal();
        }
      } else {
        // 토큰 발행 실패
        showToast("알림 토큰 발행에 실패했습니다.", "ERROR");
        hideModal();
      }
    } catch (error) {
      console.error("❌ [FCM] 알림 권한 요청 오류:", error);
      showToast("알림 권한 요청 중 오류가 발생했습니다.", "ERROR");
    } finally {
      // 모든 경우에 모달 닫기
      hideModal();
    }
  };

  return (
    <ModalOverlay onClick={hideModal}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={hideModal} aria-label="닫기">
          <IoClose size={20} />
        </CloseButton>
        <Title>비비의 꿀 같은 소식을 놓치지 마세요!</Title>
        <Description>중요한 알림과 메시지를 받아볼 수 있어요</Description>
        <ButtonGroup>
          <CancelButton onClick={hideModal}>나중에</CancelButton>
          <AllowButton onClick={handleAllowNotification}>알림 받기</AllowButton>
        </ButtonGroup>
      </ModalContent>
    </ModalOverlay>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${fadeIn} 0.3s ease-out;
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 24px;
  max-width: 400px;
  width: 100%;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  animation: ${slideUp} 0.3s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.color.subText2};
  transition: color 0.2s;
  z-index: 1;

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`;

const Title = styled.h2`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  margin: 0 0 12px 0;
  text-align: center;
  padding-right: 32px;
  line-height: 1.4;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  margin: 0 0 24px 0;
  text-align: center;
  line-height: 1.5;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const CancelButton = styled.button`
  flex: 1;
  padding: 14px;
  background: ${({ theme }) => theme.color.natural100};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.subText2};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.color.natural200};
  }
`;

const AllowButton = styled.button`
  flex: 1;
  padding: 14px;
  background: ${({ theme }) => theme.color.main};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ theme }) => theme.color.main};
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;
