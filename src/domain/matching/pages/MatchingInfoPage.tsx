import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import MatchingInfo from "../components/info/MatchingInfo";
import MatchingActionSheetModal from "../components/common/MatchingActionSheetModal";

import type { EngagementDetail } from "../../../types/match.type";
import { getEngagementDetail } from "../../../api/engagementApi";

const MatchingInfoPage = () => {
  const navigate = useNavigate();
  const { agreementId } = useParams<{
    agreementId: string;
  }>();

  const [engagement, setEngagement] = useState<EngagementDetail | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getEngagementDetail(agreementId).then((res) => {
      setEngagement(res.data);
    });
  }, [agreementId]);
  return (
    <Layout>
      <span className="sr-only">
        매칭 확인서 페이지 입니다. 확정된 매칭 확인서를 확인할 수 있습니다.
      </span>
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
        aria-label="매칭 취소하기 및 신고하기"
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
