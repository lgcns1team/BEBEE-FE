import styled from "styled-components";
import Header from "../../../components/Header";
import DisabledMyPage from "./DisabledMyPage";
import HelperMyPage from "./HelperMyPage";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../../store/useUserStore";
import { Toast } from "../../../components/Toast";
import { useToastStore } from "../../../store/useToastStore";

const MY_PAGE_BY_ROLE = {
  DISABLED: DisabledMyPage,
  HELPER: HelperMyPage,
} as const;

const MyPage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const RoleMyPage = user.role ? MY_PAGE_BY_ROLE[user.role] : null;

  if (!RoleMyPage) {
    useToastStore.getState().showToast("로그인이 필요합니다.", "ERROR");
    navigate("/login");

    return null;
  }

  return (
    <Container>
      <Header title="나의 비비" />
      <ContentArea>
        <RoleMyPage />
      </ContentArea>
      <Toast />
    </Container>
  );
};

export default MyPage;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.color.white};
`;

const ContentArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 80px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;
