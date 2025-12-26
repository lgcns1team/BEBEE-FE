import React, { useState } from "react";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate, useParams } from "react-router-dom";
import MatchingInfo from "../components/info/MatchingInfo";
import MatchingActionSheetModal from "../components/common/MatchingActionSheetModal";
import { usePostStore } from "../../../store/usePostStore";
const MatchingInfoPage = () => {
  const navigate = useNavigate();
  const { infoId } = useParams();
  const { posts } = usePostStore();
  const [isMatchingActionSheetOpen, setIsMatchingActionSheetOpen] =
    useState(false);
  // id에 맞는 매칭 정보 찾기
  const post = posts.find((item) => item.postId === Number(infoId));

  return (
    <Layout>
      <Header
        title="매칭 확인서"
        onBack={() => navigate(-1)}
        showRight
        onRightClick={() => setIsMatchingActionSheetOpen(true)}
      />
      <MatchingActionSheetModal
        isOpen={isMatchingActionSheetOpen}
        onClose={() => setIsMatchingActionSheetOpen(false)}
      />
      {/* 매칭 정보가 없을 경우 */}
      {!post ? (
        <div>매칭 정보를 불러올 수 없습니다.</div>
      ) : (
        <MatchingInfo post={post} />
      )}
    </Layout>
  );
};

export default MatchingInfoPage;
