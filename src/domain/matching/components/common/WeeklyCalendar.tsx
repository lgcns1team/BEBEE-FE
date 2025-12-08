import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";

const generateDates = (center: Date, count = 60) => {
  const arr = [];
  const half = Math.floor(count / 2);

  for (let i = -half; i <= half; i++) {
    arr.push(addDays(center, i));
  }
  return arr;
};

const WeeklyCalendar = () => {
  const today = new Date();
  const [centerDate, setCenterDate] = useState(today);
  const [dates, setDates] = useState(() => generateDates(today));
  const [selected, setSelected] = useState<Date | null>(today);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  /* -------------------------------------
     🔵 오늘 날짜를 처음에 가운데로 놓기
  -------------------------------------- */
  useEffect(() => {
    if (!scrollRef.current) return;
    if (!isInitialMount.current) return;

    const el = scrollRef.current;

    const todayStr = format(today, "yyyy-MM-dd");
    const todayIndex = dates.findIndex(
      (d) => format(d, "yyyy-MM-dd") === todayStr
    );

    if (todayIndex === -1) return;

    const prevScrollBehavior = el.style.scrollBehavior;
    el.style.scrollBehavior = "auto";

    const itemWidth = el.scrollWidth / dates.length;

    const scrollTo =
      todayIndex * itemWidth - el.clientWidth / 2 + itemWidth / 2;

    el.scrollLeft = scrollTo;

    el.style.scrollBehavior = prevScrollBehavior || "smooth";
    isInitialMount.current = false;
  }, [dates]);

  /* -------------------------------------
     🔵 특정 날짜를 가운데로 스크롤 이동시키기
  -------------------------------------- */
  const scrollToCenter = (target: Date) => {
    const el = scrollRef.current;
    if (!el) return;

    const index = dates.findIndex(
      (d) => format(d, "yyyy-MM-dd") === format(target, "yyyy-MM-dd")
    );

    if (index === -1) return;

    const itemWidth = el.scrollWidth / dates.length;

    const scrollTo = index * itemWidth - el.clientWidth / 2 + itemWidth / 2;

    // 부드럽게 이동
    el.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });
  };

  /* -------------------------------------
     🔵 무한 스크롤 확장
  -------------------------------------- */
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;

    if (el.scrollLeft < 200) {
      const newCenter = addDays(centerDate, -20);
      setCenterDate(newCenter);
      setDates(generateDates(newCenter));
    }

    if (el.scrollLeft > el.scrollWidth - el.clientWidth - 200) {
      const newCenter = addDays(centerDate, 20);
      setCenterDate(newCenter);
      setDates(generateDates(newCenter));
    }
  };

  return (
    <Wrapper>
      <ScrollContainer ref={scrollRef} onScroll={handleScroll}>
        {dates.map((d) => {
          const isSelected =
            selected !== null &&
            format(selected, "yyyy-MM-dd") === format(d, "yyyy-MM-dd");

          const handleSelect = () => {
            if (isSelected) {
              setSelected(null);
            } else {
              setSelected(d);
              scrollToCenter(d); /** ← ⭐ 클릭한 날짜를 가운데로 이동 */
            }
          };

          return (
            <DayBox
              key={d.toISOString()}
              $active={isSelected}
              onClick={handleSelect}
            >
              <Month>{format(d, "MMM", { locale: ko })}</Month>
              <Day>{format(d, "d")}</Day>
              <Weekday>{format(d, "EEE", { locale: ko })}</Weekday>
            </DayBox>
          );
        })}
      </ScrollContainer>
    </Wrapper>
  );
};

export default WeeklyCalendar;

/* ---------------- Styled Components ---------------- */

const Wrapper = styled.div`
  width: 100%;
  overflow: hidden;
`;

const ScrollContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;
  scroll-behavior: smooth;
  padding: 0 12px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DayBox = styled.div<{ $active: boolean }>`
  width: calc(100% / 5);
  min-width: calc(100% / 5);
  max-width: calc(100% / 5);
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 0 5px;
  margin: 0 5px;
  background: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.natural100};
  color: ${({ $active, theme }) =>
    $active ? theme.color.white : theme.color.text};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
`;

const Month = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  margin-bottom: 4px;
`;

const Day = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const Weekday = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  margin-top: 2px;
`;
