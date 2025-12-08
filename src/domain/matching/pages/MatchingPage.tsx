import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Layout from "../../../components/Layout";
import PeriodToggle from "../components/common/PeriodToggle";
import Category from "../components/common/Category";
import MatchingPostCard from "../components/list/MatchingPostCard";
import { useMatchPostStore } from "../../../store/useMatchPostStore";
import { useTabStore } from "../../../store/useTabStore";
import NavBar from "../../../components/NavBar";
import styled from "styled-components";
import MonthlyCalendar from "../components/common/MonthlyCalendar";
import WeeklyCalendar from "../components/common/WeeklyCalendar";

const MatchingPage = () => {
  const navigate = useNavigate();
  const { posts } = useMatchPostStore();
  const { activeTab } = useTabStore();

  const [period, setPeriod] = useState<"week" | "month">("week");

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "전체") return true;
    return post.category === activeTab;
  });

  return (
    <Layout>
      <PageContainer>
        <Header title="매칭 현황" onBack={() => navigate(-1)} />

        <StickyBox>
          <PeriodToggle active={period} onChange={setPeriod} />
          {period === "week" ? <WeeklyCalendar /> : <MonthlyCalendar />}
          <Category />
        </StickyBox>

        <ScrollArea>
          {filteredPosts.map((post) => (
            <MatchingPostCard key={post.id} post={post} />
          ))}
        </ScrollArea>

        <NavBar />
      </PageContainer>
    </Layout>
  );
};
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const StickyBox = styled.div`
  position: sticky;
  top: 0;
  z-index: 50;
  background: ${({ theme }) => theme.color.white};
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default MatchingPage;
