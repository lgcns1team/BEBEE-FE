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
    <div style={{ paddingBottom: "80px" }}>
      <Header title="나의 비비" />
      <RoleMyPage />
      <Toast />
    </div>
  );
};

export default MyPage;
