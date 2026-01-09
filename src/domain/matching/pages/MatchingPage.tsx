import { useState, useEffect } from "react";

import Header from "../../../components/Header";
import Layout from "../../../components/Layout";
import PeriodToggle from "../components/common/PeriodToggle";
import Category, { type TabType } from "../components/common/Category";
import MatchingPostCard from "../components/list/MatchingPostCard";

import NavBar from "../../../components/NavBar";
import styled from "styled-components";
import MonthlyCalendar from "../components/common/MonthlyCalendar";
import WeeklyCalendar from "../components/common/WeeklyCalendar";
import { useMatchStore } from "../store/useMatchStore";
import { getEngagements } from "../../../api/engagementApi";
import { getEngagementDateSet } from "../utils/engagementDates";
import { getEngagementCompleteStatus } from "../../../api/engagementApi";
import type { Engagement, EngagementType } from "../../../types/match.type";

const MatchingPage = () => {
  const { engagements, setEngagements } = useMatchStore();
  const [engagementDates, setEngagementDates] = useState<Set<string>>(
    new Set()
  );
  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [period, setPeriod] = useState<"week" | "month">("month");
  const [selectedDate, setSelectedDate] = useState("2026-01-05");

  const handleComplete = async (engagementId: string) => {
    const res = await getEngagementCompleteStatus({ engagementId });
    const { isLastEngagement } = res.data;

    setEngagements((prev: Engagement[]) =>
      prev.map((e) => {
        if (e.engagementId !== engagementId) return e;

        return {
          ...e,
          status: isLastEngagement ? "REVIEW_ACTIVE" : "COMPLETED",
        };
      })
    );
  };
  useEffect(() => {
    const types: EngagementType[] =
      activeTab === "전체"
        ? ["DAY", "TERM"]
        : activeTab === "하루 도움"
        ? ["DAY"]
        : ["TERM"];

    Promise.all(
      types.map((type) => getEngagements({ date: selectedDate, type }))
    ).then((res) => {
      const merged = res.flatMap((r) => r.data.matches);
      setEngagements(merged);
      setEngagementDates(getEngagementDateSet(merged));
    });
  }, [activeTab, selectedDate]);

  return (
    <Layout>
      <PageContainer>
        <span className="sr-only">
          활동 관리 페이지 입니다. 매칭된 활동 목록을 확인할 수 있습니다.
        </span>
        <Header title="활동 관리" />

        <StickyBox>
          <PeriodToggle
            active={period}
            onChange={setPeriod}
            aria-label="활동을 한 달 보기와 한 주 보기 중 선택하여 확인할 수 있습니다"
          />
          {period === "week" ? (
            <WeeklyCalendar
              onSelectDate={(date) => setSelectedDate(date)}
              markedDates={engagementDates}
              aria-label="한 주 보기로 확인할 수 있습니다"
            />
          ) : (
            <MonthlyCalendar
              onSelectDate={(date) => setSelectedDate(date)}
              markedDates={engagementDates}
              aria-label="한 달 보기로 확인할 수 있습니다"
            />
          )}

          <Category
            activeTab={activeTab}
            onChange={setActiveTab}
            aria-label="전체, 하루도움, 지속도움 중 선택하여서 확인할 수 있습니다."
          />
        </StickyBox>

        <ScrollArea>
          {engagements.map((engagement) => (
            <MatchingPostCard
              key={engagement.engagementId}
              engagement={engagement}
              onComplete={handleComplete}
            />
          ))}
        </ScrollArea>

        <NavBar />
      </PageContainer>
    </Layout>
  );
};

export default MatchingPage;

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
