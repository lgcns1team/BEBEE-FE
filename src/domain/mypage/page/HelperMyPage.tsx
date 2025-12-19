import { Natural50 } from "../style/MyPageSTyle";
import PointSection from "../components/common/PointSection";
import ProfileSection from "../components/common/ProfileSection";
import CareerSection from "../helper/CareerSection";
import BottomMenuSection from "../components/common/BottomMenuSection";
const HelperMyPage = () => {
  return (
    <Natural50>
      <PointSection />
      <ProfileSection />
      <CareerSection />
      <BottomMenuSection />
    </Natural50>
  );
};

export default HelperMyPage;
