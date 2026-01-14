import styled from "styled-components";
import { useState } from "react";
import Header from "../../../components/Header";
import DisabledMyPage from "./DisabledMyPage";
import HelperMyPage from "./HelperMyPage";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/useUserStore";
import { useMemberStore } from "../../../store/useMemberStore";
import { Toast } from "../../../components/Toast";
import { useToastStore } from "../../../store/useToastStore";
import { logoutUser } from "../../../api/authApi";
import { AUTH_API_URLS } from "../../auth/auth.constants";

const MY_PAGE_BY_ROLE = {
  DISABLED: DisabledMyPage,
  HELPER: HelperMyPage,
} as const;

const MyPage = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();
  const { clearMember } = useMemberStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const RoleMyPage = user?.role ? MY_PAGE_BY_ROLE[user.role] : null;

  if (!user || !RoleMyPage) {
    useToastStore.getState().showToast("로그인이 필요합니다.", "ERROR");
    navigate("/login");

    return null;
  }

  const handleLogout = async () => {
    console.log("[로그아웃] 로그아웃 시작");
    console.log("[로그아웃] 현재 상태:", { isLoggingOut, user });

    if (isLoggingOut || !user?.memberId) {
      console.log("[로그아웃] 로그아웃 중이거나 memberId가 없어 중단");
      return;
    }

    setIsLoggingOut(true);
    const memberId = user.memberId; // clearUser() 호출 전에 저장
    console.log("[로그아웃] memberId:", memberId);

    try {
      console.log("[로그아웃] API 호출 시작:", AUTH_API_URLS.LOGOUT);
      const result = await logoutUser(memberId);
      console.log("[로그아웃] API 호출 성공:", result);
      useToastStore.getState().showToast("로그아웃되었습니다.", "SUCCESS");

      // Toast가 표시되는 시간(2500ms) 후에 로그아웃 처리
      setTimeout(() => {
        clearUser();
        clearMember();
        setIsLoggingOut(false);
        navigate("/login", { replace: true });
      }, 1800);
    } catch (error) {
      console.error("[로그아웃] API 호출 실패:", error);
      useToastStore.getState().showToast("로그아웃에 실패했습니다.", "ERROR");

      // 실패 시에는 로그아웃 처리하지 않고 로딩 상태만 해제
      setIsLoggingOut(false);
    }
  };

  return (
    <Container>
      <Header title="나의 비비" />
      <ContentArea>
        <RoleMyPage />
        <Logout onClick={handleLogout} disabled={isLoggingOut}>
          {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
        </Logout>
      </ContentArea>
      <Toast position="bottom" />
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
  width: 100%;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.white};
  overscroll-behavior: none;
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 100px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Logout = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 48px;
  background-color: ${({ theme }) => theme.color.white};
  border: none;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;
