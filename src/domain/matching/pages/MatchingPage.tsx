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
// import { useUserStore } from "../../../store/useUserStore";

// const MEMBER_ID = "100";

const MatchingPage = () => {
  const { engagements, setEngagements } = useMatchStore();

  const [activeTab, setActiveTab] = useState<TabType>("전체");
  const [period, setPeriod] = useState<"week" | "month">("month");
  const [selectedDate, setSelectedDate] = useState("2026-01-05");
  const [engagementDates, setEngagementDates] = useState<Set<string>>(
    new Set()
  );
  // const { user } = useUserStore();
  // const memberId = user?.memberId;
  const handleComplete = async (agreementId: string) => {
    try {
      const res = await getEngagementCompleteStatus({
        agreementId,
        // currentMemberId: "700",
      });
      const { status, isLastActivity } = res.data;

      setEngagements(
        engagements.map((e) =>
          e.agreementId === agreementId
            ? {
                ...e,
                isDayComplete: status === "COMPLETED" ? true : e.isDayComplete,
                isTermComplete:
                  status === "COMPLETED" ? true : e.isTermComplete,
                isLastActivity,
              }
            : e
        )
      );

      if (status === "COMPLETED") {
        alert(
          isLastActivity
            ? "모든 활동이 완료되었습니다. 리뷰를 작성해 주세요"
            : "활동이 완료되었습니다."
        );
      } else {
        alert("상대방의 확인을 기다리고 있습니다.");
      }
    } catch (error) {
      console.error("활동 완료 처리 실패", error);
      alert("활동 완료 처리에 실패했습니다.");
    }
  };

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
              key={engagement.agreementId}
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
