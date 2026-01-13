import { useState, useEffect } from "react";
import styled from "styled-components";
import alarmLogo from "../assets/images/alarm-logo.png";
import { GoBell } from "react-icons/go";
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

const Alarm = () => {
  const { user } = useUserStore();
  const { showToast } = useToastStore();
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);

  // 권한 상태 확인 및 업데이트
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);

      // 권한 상태 변경 감지
      const checkPermission = () => {
        setPermissionStatus(Notification.permission);
      };

      // 주기적으로 권한 상태 확인 (권한이 변경될 수 있음)
      const interval = setInterval(checkPermission, 1000);

      return () => clearInterval(interval);
    }
  }, []);

  const handleAlarmClick = async () => {
    // 로그인하지 않은 경우
    if (!user) {
      showToast("로그인이 필요합니다.", "ERROR");
      return;
    }

    // 이미 권한이 있는 경우
    if (permissionStatus === "granted") {
      showToast("알림 권한이 이미 허용되어 있습니다.", "SUCCESS");
      return;
    }

    // 권한이 거부된 경우
    if (permissionStatus === "denied") {
      showToast(
        "알림 권한이 거부되었습니다. 브라우저 설정에서 변경해주세요.",
        "ERROR"
      );
      return;
    }

    // 권한 요청 중
    if (isRequesting) {
      return;
    }

    setIsRequesting(true);

    try {
      // 사용자 상호작용 후 알림 권한 요청 (배포 환경에서 작동)
      const token = await initializeFCM(true);

      if (token) {
        // 서버에 토큰 등록
        try {
          const deviceType = detectDeviceType();
          await registerFCMToken(token, deviceType);
          setPermissionStatus("granted");
          showToast("알림 권한이 허용되었습니다.", "SUCCESS");

          // 포그라운드 메시지 리스너 설정
          setupFCMMessageListener();
        } catch (error) {
          console.error("❌ [FCM] 토큰 서버 등록 실패:", error);
          showToast("토큰 등록에 실패했습니다.", "ERROR");
        }
      } else {
        // 권한이 거부된 경우
        const currentPermission = Notification.permission;
        setPermissionStatus(currentPermission);
        if (currentPermission === "denied") {
          showToast("알림 권한이 거부되었습니다.", "ERROR");
        } else {
          showToast("알림 권한 요청에 실패했습니다.", "ERROR");
        }
      }
    } catch (error) {
      console.error("❌ [FCM] 알림 권한 요청 오류:", error);
      showToast("알림 권한 요청 중 오류가 발생했습니다.", "ERROR");
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Container>
      <ImaBox>
        <AlarmImage src={alarmLogo} alt="알림 로고" />
      </ImaBox>
      <Bell
        $hasPermission={permissionStatus === "granted"}
        $isRequesting={isRequesting}
        onClick={handleAlarmClick}
      >
        <GoBell />
        {isRequesting && <LoadingText>요청 중...</LoadingText>}
      </Bell>
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

const Bell = styled.div<{ $hasPermission?: boolean; $isRequesting?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  cursor: ${({ $isRequesting }) => ($isRequesting ? "not-allowed" : "pointer")};
  opacity: ${({ $isRequesting }) => ($isRequesting ? 0.6 : 1)};
  color: ${({ theme }) => theme.color.text};

  &:hover {
    opacity: ${({ $isRequesting }) => ($isRequesting ? 0.6 : 0.8)};
  }
`;

const LoadingText = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.color.subText2};
`;
