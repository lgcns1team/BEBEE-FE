import { useNavigate } from "react-router-dom";

import Layout from "../../../components/Layout";
import Header from "../../../components/Header";

import DisabilitySection from "../components/disabled/DisabilitySection";

import ProfileDetailSection from "../components/common/ProfileDetailSection";

import ReceivedReview from "../components/common/ReceivedReview";
import styled from "styled-components";

const DisabledProfilePage = () => {
  const navigate = useNavigate();
  return (
    <Layout bg>
      <Header title="프로필 정보" onBack={() => navigate(-1)} bg showBack />
<ScrollContainer>
      <ProfileDetailSection />

      <DisabilitySection />
      <ReceivedReview mode="other" />
      </ScrollContainer>
    </Layout>
  );
};

export default DisabledProfilePage;

const ScrollContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 24px;

  /* iOS 스크롤 자연스럽게 */
  -webkit-overflow-scrolling: touch;
`;