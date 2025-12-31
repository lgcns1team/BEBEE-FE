import styled from "styled-components";
import type { MatchingHelp } from "../../match.types";

/* 요일 한글 매핑 */
const DAY_KR_MAP: Record<
  "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN",
  string
> = {
  MON: "월요일",
  TUE: "화요일",
  WED: "수요일",
  THU: "목요일",
  FRI: "금요일",
  SAT: "토요일",
  SUN: "일요일",
};

/* 날짜 포맷: YYYY.MM.DD */
const formatDate = (date: Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
};

/* 시간 포맷: HH:MM */
const formatTime = (date: Date) => {
  const d = new Date(date);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
};

interface Props {
  help: MatchingHelp;
}

const HelpInfo = ({ help }: Props) => {
  const isOneDay = help.type === "하루 도움";

  return (
    <Wrapper>
      {/* 방식 */}
      <Row>
        <Label>방식</Label>
        <Value>{help.type}</Value>
      </Row>

      {/* 날짜 */}
      <Row>
        <Label>날짜</Label>
        <Value>
          {isOneDay
            ? formatDate(help.engagementDate)
            : `${formatDate(help.startDate)} ~ ${formatDate(help.endDate)}`}
        </Value>
      </Row>

      {/* 시간 / 일정 */}
      <Row>
        <Label>{isOneDay ? "시간" : "일시"}</Label>
        <Value>
          {isOneDay ? (
            `${formatTime(help.time.startTime)} ~ ${formatTime(
              help.time.endTime
            )}`
          ) : (
            <ScheduleList>
              {help.dayOfWeek?.map((item) => (
                <ScheduleItem key={item.dayOfWeek}>
                  {DAY_KR_MAP[item.dayOfWeek]} · {item.startTime} ~{" "}
                  {item.endTime}
                </ScheduleItem>
              ))}
            </ScheduleList>
          )}
        </Value>
      </Row>

      {/* 제공 꿀 */}
      <Row>
        <Label>제공 꿀</Label>
        <Value>{help.totalHoney}꿀</Value>
      </Row>

      {/* 장소 */}
      <Row>
        <Label>만남 장소</Label>
        <Value>{help.region}</Value>
      </Row>
    </Wrapper>
  );
};

export default HelpInfo;

/* ---------------- styled ---------------- */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
`;

const Label = styled.div`
  width: 80px;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  flex-shrink: 0;
`;

const Value = styled.div`
  flex: 1;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  line-height: 1.5;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ScheduleItem = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;
