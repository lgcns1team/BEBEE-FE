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

const MEMBER_ID = "100";

const MatchingPage = () => {
  const { engagements, setEngagements } = useMatchStore();

  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [period, setPeriod] = useState<"week" | "month">("month");
  const [selectedDate, setSelectedDate] = useState("2025-12-30");
  const [engagementDates, setEngagementDates] = useState<Set<string>>(
    new Set()
  );
  useEffect(() => {
    const types: ("DAY" | "TERM")[] =
      activeTab === "전체"
        ? ["DAY", "TERM"]
        : activeTab === "하루 도움"
        ? ["DAY"]
        : ["TERM"];
    Promise.all(
      types.map((type) =>
        getEngagements({
          memberId: MEMBER_ID,
          date: selectedDate,
          engagementType: type,
        })
      )
    ).then((responses) => {
      const merged = responses.flatMap((res) => res.data.matches);
      setEngagements(merged);
      setEngagementDates(getEngagementDateSet(merged));
    });
  }, [activeTab, selectedDate]);

  return (
    <Layout>
      <PageContainer>
        <Header title="활동 관리" />

        <StickyBox>
          <PeriodToggle active={period} onChange={setPeriod} />
          {period === "week" ? (
            <WeeklyCalendar
              onSelectDate={(date) => setSelectedDate(date)}
              markedDates={engagementDates}
            />
          ) : (
            <MonthlyCalendar
              onSelectDate={(date) => setSelectedDate(date)}
              markedDates={engagementDates}
            />
          )}

          <Category activeTab={activeTab} onChange={setActiveTab} />
        </StickyBox>

        <ScrollArea>
          {engagements.map((engagement) => (
            <MatchingPostCard
              key={engagement.agreementId}
              engagement={engagement}
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
