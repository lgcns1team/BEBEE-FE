import { useState, useEffect } from "react";
import styled from "styled-components";
import { HiBell } from "react-icons/hi";
import mypage1 from "../../../../assets/images/mypage-1.png";
import mypage2 from "../../../../assets/images/mypage-2.png";
import mypage3 from "../../../../assets/images/mypage-3.png";
import mypage4 from "../../../../assets/images/mypage-4.png";
import {
  initializeFCM,
  setupFCMMessageListener,
} from "../../../../hooks/useFirebaseHandler";
import { registerFCMToken } from "../../../../api/notificationApi";
import { useUserStore } from "../../../../store/useUserStore";
import { useToastStore } from "../../../../store/useToastStore";

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

// PWA 환경 감지 유틸리티
const isPWAEnvironment = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as { standalone?: boolean }).standalone === true) ||
    document.referrer.includes("android-app://")
  );
};

const MENU_ITEMS = [
  {
    icon: mypage1,
    text: "활동 내역",
  },
  {
    icon: mypage2,
    text: "고객 센터",
  },
  {
    icon: mypage3,
    text: "공지사항",
  },
  {
    icon: mypage4,
    text: "자주 묻는 질문",
  },
];

const BottomMenuSection = () => {
  const { user } = useUserStore();
  const { showToast } = useToastStore();
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [isToggledOff, setIsToggledOff] = useState(false); // 토글 OFF 상태 관리

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

  // 토글 스위치 클릭 핸들러
  const handleToggleClick = async () => {
    // 로그인하지 않은 경우
    if (!user) {
      showToast("로그인이 필요합니다.", "ERROR");
      return;
    }

    // 권한 요청 중
    if (isRequesting) {
      return;
    }

    // 현재 토글 상태 확인
    const isCurrentlyOn = permissionStatus === "granted" && !isToggledOff;

    // 허용 상태 (ON)에서 클릭 -> 비허용 (OFF)로 전환
    if (isCurrentlyOn) {
      setIsToggledOff(true);
      showToast("알림이 비활성화되었습니다.", "SUCCESS");
      return;
    }

    // 비허용 상태 (OFF)에서 클릭 -> 허용 (ON)으로 전환 (권한 요청)
    // 권한이 거부된 경우
    if (permissionStatus === "denied") {
      showToast(
        "알림 권한이 거부되었습니다. 브라우저 설정에서 변경해주세요.",
        "ERROR"
      );
      return;
    }

    setIsRequesting(true);

    try {
      // PWA 환경 확인 (디버깅용)
      const isPWA = isPWAEnvironment();
      if (import.meta.env.DEV) {
        console.log("🔔 [알림 토글] PWA 환경:", isPWA);
      }

      // 1. 클릭하자마자 권한부터 요청 (iOS 제스처 유효 시간 확보)
      let permission: NotificationPermission;
      try {
        permission = await Notification.requestPermission();
      } catch (error) {
        console.error("[FCM] 알림 권한 요청 오류:", error);
        showToast("알림 권한 요청 중 오류가 발생했습니다.", "ERROR");
        return;
      }

      // 권한이 허용되지 않은 경우
      if (permission !== "granted") {
        setPermissionStatus(permission);
        if (permission === "denied") {
          showToast("알림 권한이 거부되었습니다.", "ERROR");
        } else {
          // PWA 환경에서의 추가 안내
          if (isPWA) {
            showToast(
              "알림 권한 요청에 실패했습니다. 앱 설정에서 알림을 허용해주세요.",
              "ERROR"
            );
          } else {
            showToast("알림 권한 요청에 실패했습니다.", "ERROR");
          }
        }
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
          setPermissionStatus("granted");
          setIsToggledOff(false); // 허용 상태로 전환
          showToast("알림 권한이 허용되었습니다.", "SUCCESS");

          // 포그라운드 메시지 리스너 설정
          setupFCMMessageListener();
        } catch (error) {
          console.error("[FCM] 토큰 서버 등록 실패:", error);
          showToast("토큰 등록에 실패했습니다.", "ERROR");
        }
      } else {
        // 토큰 발행 실패
        showToast("알림 토큰 발행에 실패했습니다.", "ERROR");
      }
    } catch (error) {
      console.error("[FCM] 알림 권한 요청 오류:", error);
      const errorMessage =
        error instanceof Error ? error.message : "알 수 없는 오류";

      // Service Worker 관련 오류인 경우
      if (
        errorMessage.includes("Service Worker") ||
        errorMessage.includes("PushManager")
      ) {
        showToast(
          "Service Worker 준비 중입니다. 잠시 후 다시 시도해주세요.",
          "ERROR"
        );
      } else {
        showToast("알림 권한 요청 중 오류가 발생했습니다.", "ERROR");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <MenuContainer>
      <MenuList>
        {MENU_ITEMS.map((item, index) => (
          <MenuItem key={index}>
            <MenuIconContainer>
              <MenuIcon src={item.icon} alt={item.text} />
            </MenuIconContainer>
            <MenuText>{item.text}</MenuText>
          </MenuItem>
        ))}
        {/* 알림 허용 메뉴 항목 */}
        <NotificationMenuItem>
          <NotificationIconContainer>
            <HiBell size={20} color={"#FFBE00"} />
          </NotificationIconContainer>
          <MenuText>알림</MenuText>
          <ToggleSwitchWrapper>
            <ToggleSwitch
              $checked={permissionStatus === "granted" && !isToggledOff}
              $disabled={isRequesting || permissionStatus === "denied"}
              onClick={handleToggleClick}
              role="switch"
              aria-checked={permissionStatus === "granted" && !isToggledOff}
              aria-label="알림 허용"
            >
              <ToggleHandle
                $checked={permissionStatus === "granted" && !isToggledOff}
              />
            </ToggleSwitch>
          </ToggleSwitchWrapper>
        </NotificationMenuItem>
      </MenuList>
    </MenuContainer>
  );
};

export default BottomMenuSection;

const MenuContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
`;
const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 16px;
  gap: 16px;
`;

const MenuItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
`;
const MenuIconContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.natural100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 0.5px solid ${({ theme }) => theme.color.natural100};
`;
const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
  padding: 4px;
`;
const MenuText = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;

const NotificationMenuItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
`;

const NotificationIconContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.natural100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 0.5px solid ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
`;

const ToggleSwitchWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;

const ToggleSwitch = styled.button<{
  $checked: boolean;
  $disabled?: boolean;
}>`
  position: relative;
  width: 51px;
  height: 31px;
  border-radius: 31px;
  border: none;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.3s ease;
  background-color: ${({ $checked, theme, $disabled }) =>
    $disabled
      ? theme.color.natural200
      : $checked
      ? "#4CD964"
      : theme.color.natural200};
  opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
  padding: 0;
  outline: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.main};
    outline-offset: 2px;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }
`;

const ToggleHandle = styled.div<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${({ $checked }) => ($checked ? "22px" : "2px")};
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: white;
  transition: left 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;
