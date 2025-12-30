import { Natural50 } from "../style/MyPageSTyle";
import PointSection from "../components/common/PointSection";
import ProfileSection from "../components/common/ProfileSection";
import CareerSection from "../helper/CareerSection";
import BottomMenuSection from "../components/common/BottomMenuSection";
import NavBar from "../../../components/NavBar";
const HelperMyPage = () => {
  return (
    <Natural50>
      <PointSection />
      <ProfileSection />
      <CareerSection />
      <BottomMenuSection />
      <NavBar />
    </Natural50>
  );
};

export default HelperMyPage;
