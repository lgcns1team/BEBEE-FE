import { Natural50 } from "../style/MyPageStyle";
import PointSection from "../components/common/PointSection";
import ProfileSection from "../components/common/ProfileSection";
import BadgePreview from "../helper/BadgePreview";
import CareerSection from "../helper/CareerSection";
import BottomMenuSection from "../components/common/BottomMenuSection";
import NavBar from "../../../components/NavBar";
const HelperMyPage = () => {
  return (
    <Natural50>
      <PointSection />
      <ProfileSection />
      <BadgePreview />
      <CareerSection />
      <BottomMenuSection />
      <NavBar />
    </Natural50>
  );
};

export default HelperMyPage;
