import { useState, useEffect } from "react";
import styled from "styled-components";
import alarmLogo from "../assets/images/alarm-logo.png";
import { GoBell } from "react-icons/go";

const Alarm = () => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(null);

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

  return (
    <Container>
      <ImaBox>
        <AlarmImage src={alarmLogo} alt="알림 로고" />
      </ImaBox>
      <Bell $hasPermission={permissionStatus === "granted"}>
        <GoBell />
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

const Bell = styled.div<{ $hasPermission?: boolean }>`
  display: flex;
  align-items: center;
  font-size: 20px;
  color: ${({ $hasPermission, theme }) => ($hasPermission ? theme.color.main : "inherit")};
  transition: color 0.2s;
`;
