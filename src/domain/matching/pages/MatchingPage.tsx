import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import NavBar from "../../../components/NavBar";

import PeriodToggle from "../components/common/PeriodToggle";
import Category, { type TabType } from "../components/common/Category";
import WeeklyCalendar from "../components/common/WeeklyCalendar";
import MonthlyCalendar from "../components/common/MonthlyCalendar";
import MatchingPostCard from "../components/list/MatchingPostCard";

import { useMatchStore } from "../store/useMatchStore";
import {
  completeEngagement,
  getEngagements,
  getEngagementsCalendar,
} from "../../../api/engagementApi";
import { toDateSet } from "../utils/engagementDates";

import type { EngagementType } from "../../../types/match.type";

const MatchingPage = () => {
  const { engagements, setEngagements } = useMatchStore();

  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [period, setPeriod] = useState<"week" | "month">("month");

  const [selectedDate, setSelectedDate] = useState("2026-01-09");

  const selectedType: EngagementType | null = useMemo(() => {
    if (activeTab === "하루 도움") return "DAY";
    if (activeTab === "지속 도움") return "TERM";
    return undefined; // 전체
  }, [activeTab]);

  // 활동 완료
  const handleComplete = async (engagementId: string) => {
    const res = await completeEngagement(engagementId);
    const { isLastEngagement } = res.data;

    setEngagements((prev) =>
      prev.map((e) =>
        e.engagementId === engagementId
          ? { ...e, status: isLastEngagement ? "REVIEW_ACTIVE" : "COMPLETED" }
          : e
      )
    );
  };

  // 캘린더 조회
  useEffect(() => {
    const [y, m] = selectedDate.split("-").map(Number);
    if (!y || !m) return;

    getEngagementsCalendar({ year: y, month: m, type: selectedType })
      .then((res) => {
        setMarkedDates(toDateSet(res.data.activeDates));
      })
      .catch((e) => {
        console.error("calendar 조회 실패", e);
        setMarkedDates(new Set());
      });
  }, [selectedDate, selectedType]);

  useEffect(() => {
    getEngagements({ date: selectedDate, type: selectedType })
      .then((res) => {
        setEngagements(res.data.engagements ?? []);
      })
      .catch((e) => {
        console.error("engagements 조회 실패", e);
        setEngagements([]);
      });
  }, [selectedDate, selectedType, setEngagements]);

  return (
    <Layout>
      <PageContainer>
        <Header title="활동 관리" />

        <StickyBox>
          <PeriodToggle active={period} onChange={setPeriod} />

          {period === "week" ? (
            <WeeklyCalendar
              onSelectDate={setSelectedDate}
              markedDates={markedDates}
            />
          ) : (
            <MonthlyCalendar
              onSelectDate={setSelectedDate}
              markedDates={markedDates}
            />
          )}

          <Category activeTab={activeTab} onChange={setActiveTab} />
        </StickyBox>

        <ScrollArea>
          {engagements.length === 0 ? (
            <Empty>선택한 날짜에 활동이 없습니다.</Empty>
          ) : (
            engagements.map((eng) => (
              <MatchingPostCard
                key={eng.engagementId}
                engagement={eng}
                onComplete={handleComplete}
              />
            ))
          )}
        </ScrollArea>

        <NavBar />
      </PageContainer>
    </Layout>
  );
};

export default MatchingPage;

/* ================= styled ================= */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const StickyBox = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  background: ${({ theme }) => theme.color.white};
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const Empty = styled.div`
  padding: 40px;
  text-align: center;
  color: ${({ theme }) => theme.color.subText2};
`;
