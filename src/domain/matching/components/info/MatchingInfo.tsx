import React from "react";
import DayHelpInfo from "./DayHelpInfo";
import LongHelpInfo from "./LongHelpInfo";
import type { MatchInfo } from "../../../../store/useMatchInfoStore";

interface Props {
  info: MatchInfo;
}

const MatchingInfo = ({ info }: Props) => {
  if (!info) return null;

  return (
    <>
      {info.type === "하루도움" ? (
        <DayHelpInfo info={info} />
      ) : (
        <LongHelpInfo info={info} />
      )}
    </>
  );
};

export default MatchingInfo;
