import styled from "styled-components";
import HelpInfo from "./HelpInfo";
import MatchingProfile from "./MatchingProfile";
import type { MatchingHelp } from "../../match.types";

const formatDate = (date: Date) =>
  `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;

interface Props {
  help: MatchingHelp;
}

const MatchingInfo = ({ help }: Props) => {
  return (
    <>
      <MatchingDate>
        {help.type === "하루 도움"
          ? formatDate(help.engagementDate)
          : `${formatDate(help.startDate)} ~ ${formatDate(help.endDate)}`}
      </MatchingDate>

      <Wrapper>
        <Status>매칭 완료</Status>
        <HelpInfo help={help} />
      </Wrapper>

      <MatchingProfile />
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
