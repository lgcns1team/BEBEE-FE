import ApplicationStatusSection from "../disabled/ApplicationStatusSection";
import PointSection from "../components/common/PointSection";
import ProfileSection from "../components/common/ProfileSection";
import DisabledTypeSection from "../disabled/DisabledTypeSection";
import BottomMenuSection from "../components/common/BottomMenuSection";
import { Natural50 } from "../style/MyPageStyle";
import NavBar from "../../../components/NavBar";

const DisabledMyPage = () => {
  return (
    <Natural50>
      <ApplicationStatusSection />
      <PointSection />
      <ProfileSection />
      <DisabledTypeSection />
      <BottomMenuSection />
      <NavBar />
    </Natural50>
  );
};

export default DisabledMyPage;
