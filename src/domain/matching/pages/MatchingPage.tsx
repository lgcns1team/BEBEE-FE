import { useNavigate } from "react-router-dom";
import MatchingCalendar from "../components/common/MatchingCalendar";
import Header from "../../../components/Header";

import { useTabStore } from "../../../store/useTabStore";
import { useMatchPostStore } from "../../../store/useMatchPostStore";
import Category from "../components/common/Category";
import Layout from "../../../components/Layout";
import PostCard from "../components/list/PostCard";
const MatchingPage = () => {
  const navigate = useNavigate();
  const { posts } = useMatchPostStore();
  const { activeTab } = useTabStore();

  // 🔥 탭 기준 필터링
  const filteredPosts = posts.filter((post) => {
    if (activeTab === "전체") return true;
    return post.category === activeTab;
  });
  return (
    <Layout>
      <div>
        <Header title="매칭 현황" onBack={() => navigate(-1)} />
        <MatchingCalendar />
        <Category />
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </Layout>
  );
};

export default MatchingPage;
