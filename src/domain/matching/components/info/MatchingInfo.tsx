import styled from "styled-components";
import HelpInfo from "./HelpInfo";
import MatchingProfile from "./MatchingProfile";
import type {
  DayEngagementTime,
  Engagement,
  TermEngagementTime,
} from "../../../../types/match.type";

const formatDate = (date: string) => {
  const d = new Date(date);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
};

interface Props {
  engagement: Engagement;
}

const MatchingInfo = ({ engagement }: Props) => {
  const isOneDay = engagement.type === "DAY";
  return (
    <>
      <MatchingDate aria-label="활동이 진행되는 날짜">
        {isOneDay ? (
          formatDate((engagement.engagementTime as DayEngagementTime).date)
        ) : (
          <>
            {formatDate(
              (engagement.engagementTime as TermEngagementTime).startDate
            )}
            {" ~ "}
            {formatDate(
              (engagement.engagementTime as TermEngagementTime).endDate
            )}
          </>
        )}
      </MatchingDate>

      <Wrapper>
        <Status>매칭 완료</Status>
        <HelpInfo engagement={engagement} />
      </Wrapper>

      <MatchingProfile engagement={engagement} />
    </>
  );
};

export default MatchingInfo;

/* styled */
const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: 12px;
  padding: 16px;
  margin: 20px 10px;
`;

const MatchingDate = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: bold;
  margin-left: 10px;
`;

const Status = styled.div`
  font-weight: bold;
  margin-bottom: 16px;
`;
