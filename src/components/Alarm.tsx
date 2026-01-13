import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import alarmLogo from "../assets/images/alarm-logo.png";
import { GoBell } from "react-icons/go";
import { useUserStore } from "../store/useUserStore";
import { useNotificationPermissionStore } from "../store/useNotificationPermissionStore";
import { useLocation } from "react-router-dom";

const Alarm = () => {
  const { user } = useUserStore();
  const location = useLocation();
  const { hasShownModal, hasShownTooltip, showTooltip } =
    useNotificationPermissionStore();
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission | null>(() => {
      if (typeof window !== "undefined" && "Notification" in window) {
        return Notification.permission;
      }
      return null;
    });
  const [showTooltipAnimation, setShowTooltipAnimation] = useState(false);

  // 권한 상태 확인 및 업데이트
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      // 권한 상태 변경 감지
      const checkPermission = () => {
        setPermissionStatus(Notification.permission);
      };

      // 주기적으로 권한 상태 확인 (권한이 변경될 수 있음)
      const interval = setInterval(checkPermission, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  // 홈 페이지 접속 시 말풍선 표시 (조건부)
  useEffect(() => {
    // 홈 페이지가 아니면 스킵
    if (location.pathname !== "/home") {
      return;
    }

    // 로그인하지 않았거나 이미 말풍선을 표시했으면 스킵
    if (!user || hasShownTooltip) {
      return;
    }

    // 브라우저 지원 확인
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    // 현재 권한 상태 확인
    const currentPermission = Notification.permission;

    // 알림 권한이 이미 허용되었으면 스킵
    if (currentPermission === "granted") {
      return;
    }

    // 모달을 이미 표시했고, 권한이 없는 경우에만 말풍선 표시
    // currentPermission이 "default" 또는 "denied"인 경우
    if (
      hasShownModal &&
      (currentPermission === "default" || currentPermission === "denied")
    ) {
      const isDev = import.meta.env.DEV;
      if (isDev) {
        console.log("💬 [Tooltip] 말풍선 표시 조건 충족:", {
          hasShownModal,
          currentPermission,
          hasShownTooltip,
        });
      }

      // 홈 페이지 접속 후 약간의 지연 후 말풍선 표시
      const timer = setTimeout(() => {
        setShowTooltipAnimation(true);
        showTooltip(); // localStorage에 저장하여 한 번만 표시

        if (isDev) {
          console.log("💬 [Tooltip] 말풍선 표시됨");
        }

        // 3초 후 자동으로 사라지게
        const hideTimer = setTimeout(() => {
          setShowTooltipAnimation(false);
          if (isDev) {
            console.log("💬 [Tooltip] 말풍선 사라짐");
          }
        }, 3000);

        return () => clearTimeout(hideTimer);
      }, 1500); // 1.5초 후 표시

      return () => clearTimeout(timer);
    } else {
      const isDev = import.meta.env.DEV;
      if (isDev) {
        console.log("💬 [Tooltip] 말풍선 표시 조건 불충족:", {
          hasShownModal,
          currentPermission,
          hasShownTooltip,
          user: !!user,
        });
      }
    }
  }, [
    location.pathname,
    user,
    hasShownModal,
    hasShownTooltip,
    permissionStatus,
    showTooltip,
  ]);

  return (
    <Container>
      <ImaBox>
        <AlarmImage src={alarmLogo} alt="알림 로고" />
      </ImaBox>
      <BellWrapper>
        <Bell $hasPermission={permissionStatus === "granted"}>
          <GoBell />
        </Bell>
        {showTooltipAnimation && (
          <Tooltip $isVisible={showTooltipAnimation}>
            알림을 받아보세요!
            <TooltipArrow />
          </Tooltip>
        )}
      </BellWrapper>
    </Container>
  );
};

export default Alarm;
const Container = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
`;
const ImaBox = styled.div`
  width: 40px;
`;
const AlarmImage = styled.img`
  width: 35px;
`;

const BellWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Bell = styled.div<{ $hasPermission?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  color: ${({ theme }) => theme.color.text};
`;

const tooltipFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const tooltipFadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
`;

const Tooltip = styled.div<{ $isVisible: boolean }>`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: ${({ theme }) => theme.color.text};
  color: ${({ theme }) => theme.color.white};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.sm};
  white-space: nowrap;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: ${({ $isVisible }) =>
      $isVisible ? tooltipFadeIn : tooltipFadeOut}
    0.3s ease-out;
  pointer-events: none;
`;

const TooltipArrow = styled.div`
  position: absolute;
  bottom: 100%;
  right: 16px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid ${({ theme }) => theme.color.text};
`;
