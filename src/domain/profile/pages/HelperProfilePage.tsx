import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import ProfileDetailSection from "../components/common/ProfileDetailSection";
import ExperienceSection from "../components/helper/ExperienceSection";
import ReceivedReview from "../components/common/ReceivedReview";
import { useProfileStore } from "../../../store/useProfileStore";
import { useParams } from "react-router-dom";
import BaseLongButton from "../../../components/BaseLongButton";
const HelperProfilePage = () => {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const { helperProfiles } = useProfileStore();
  const id = Number(profileId);
  const profile = helperProfiles.find((p) => p.memberId === id);
  return (
    <Layout bg>
      <Header title="프로필 정보" onBack={() => navigate(-1)} bg showBack />
      <ProfileDetailSection />
      <ExperienceSection />
      <ReceivedReview profileId={profile?.memberId} />
      <BaseLongButton label="채팅하기" />
    </Layout>
  );
};

export default HelperProfilePage;
