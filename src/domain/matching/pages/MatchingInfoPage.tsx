import { useState } from "react";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import MatchingInfo from "../components/info/MatchingInfo";
import MatchingActionSheetModal from "../components/common/MatchingActionSheetModal";
import { useMatchStore } from "../store/useMatchStore";

const MatchingInfoPage = () => {
  const navigate = useNavigate();
  const { agreementId } = useParams<{
    agreementId: string;
  }>();

  const getEngagementById = useMatchStore((state) => state.getEngagementById);
  const engagement = agreementId ? getEngagementById(agreementId) : undefined;

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Layout>
      <Header
        title="매칭 확인서"
        showBack
        onBack={() => navigate(-1)}
        showRight
        onRightClick={() => setIsOpen(true)}
      />

      <MatchingActionSheetModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />

      {!engagement ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          매칭 정보를 불러올 수 없습니다.
        </div>
      ) : (
        <MatchingInfo engagement={engagement} />
      )}
    </Layout>
  );
};

export default MatchingInfoPage;
