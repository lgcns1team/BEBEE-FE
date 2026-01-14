import { useNavigate } from "react-router-dom";

import Layout from "../../../components/Layout";
import Header from "../../../components/Header";

import DisabilitySection from "../components/disabled/DisabilitySection";

import ProfileDetailSection from "../components/common/ProfileDetailSection";

import ReceivedReview from "../components/common/ReceivedReview";

const DisabledProfilePage = () => {
  const navigate = useNavigate();
  return (
    <Layout bg>
      <Header title="프로필 정보" onBack={() => navigate(-1)} bg showBack />

      <ProfileDetailSection />

      <DisabilitySection />
      <ReceivedReview mode="other" />
    </Layout>
  );
};

export default DisabledProfilePage;
