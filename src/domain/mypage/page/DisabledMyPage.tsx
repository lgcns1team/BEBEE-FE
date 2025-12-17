import ApplicationStatusSection from "../disabled/ApplicationStatusSection";
import PointSection from "../components/common/PointSection";
import ProfileSection from "../components/common/ProfileSection";
import DisabledTypeSection from "../disabled/DisabledTypeSection";
import BottomMenuSection from "../components/common/BottomMenuSection";
import { Natural50 } from "../style/MyPageSTyle";

const DisabledMyPage = () => {
  return (
    <Natural50>
      <ApplicationStatusSection />
      <PointSection />
      <ProfileSection />
      <DisabledTypeSection />
      <BottomMenuSection />
    </Natural50>
  );
};

export default DisabledMyPage;
