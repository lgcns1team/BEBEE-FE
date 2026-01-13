
import { useNavigate} from "react-router-dom";

import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import BaseLongButton from "../../../components/BaseLongButton";

import ProfileDetailSection from "../components/common/ProfileDetailSection";
import ExperienceSection from "../components/helper/ExperienceSection";


import ReceivedReview from "../components/common/ReceivedReview";

const HelperProfilePage = () => {
  const navigate = useNavigate();
  
  return (
    <Layout bg>
      <Header title="프로필 정보" onBack={() => navigate(-1)} bg showBack />

      <ProfileDetailSection />

      <ExperienceSection />
      <ReceivedReview mode="other" />
      <BaseLongButton label="채팅하기" />
    </Layout>
  );
};

export default HelperProfilePage;
