import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { format, addDays } from "date-fns";
import { ko } from "date-fns/locale";

interface Props {
  onSelectDate: (date: string) => void;
  markedDates: Set<string>;
}

const formatDate = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const formatKoreanDate = (date: Date) =>
  `${date.getFullYear()}년 ${
    date.getMonth() + 1
  }월 ${date.getDate()}일 ${format(date, "EEEE", { locale: ko })}`;

const generateDates = (center: Date, count = 60) => {
  const arr = [];
  const half = Math.floor(count / 2);

  for (let i = -half; i <= half; i++) {
    arr.push(addDays(center, i));
  }
  return arr;
};

const WeeklyCalendar = ({ onSelectDate, markedDates }: Props) => {
  const today = new Date();
  const [centerDate, setCenterDate] = useState(today);
  const [dates, setDates] = useState(() => generateDates(today));
  const [selected, setSelected] = useState<Date | null>(today);

  const scrollRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);
  const [announce, setAnnounce] = useState("");
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
    <Wrapper role="region" aria-label="주간 일정 달력">
      <span className="sr-only" aria-live="polite">
        {announce}
      </span>

      <span className="sr-only">
        한 주 보기 입니다. 달력 내 날짜를 클릭하여 매칭 정보를 확인해 보세요.
      </span>
      <ScrollContainer ref={scrollRef} onScroll={handleScroll}>
        {dates.map((d) => {
          const dateKey = formatDate(d);
          const isSelected = selected && formatDate(selected) === dateKey;
          const hasEngagement = markedDates.has(dateKey);

          const handleSelect = () => {
            if (isSelected) {
              setSelected(null);
            } else {
              setSelected(d);
              onSelectDate(formatDate(d));
              scrollToCenter(d);
            }
            setAnnounce(
              `${formatKoreanDate(d)}이 선택되었습니다.${
                hasEngagement ? " 도움이 있는 날짜입니다." : ""
              }`
            );
          };

          return (
            <DayBox
              key={d.toISOString()}
              $active={isSelected}
              role="listitem"
              onClick={handleSelect}
              aria-pressed={!!isSelected}
              aria-label={`${formatKoreanDate(d)}${
                hasEngagement ? ", 도움이 있는 날짜" : ""
              }${isSelected ? ", 선택됨" : ""}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelect();
                }
              }}
            >
              <Month>{format(d, "MMM", { locale: ko })}</Month>
              <Day>{format(d, "d")}</Day>
              <Weekday>{format(d, "EEE", { locale: ko })}</Weekday>
              {hasEngagement && <Dot />}
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
  width: calc(100% / 4);
  min-width: calc(100% / 4);
  max-width: calc(100% / 4);
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 0 20px;
  margin: 0 5px;
  background: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.natural50};
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

const Dot = styled.div`
  position: absolute;
  top: 19px;
  left: 15%;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.color.main};
`;
