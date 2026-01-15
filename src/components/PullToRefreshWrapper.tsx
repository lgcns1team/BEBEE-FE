import React from "react";
import PullToRefresh from "react-simple-pull-to-refresh";
import styled from "styled-components";
import Lottie from "lottie-react";
import animationData from "../assets/lotties/loading-spinner.json";

interface PullToRefreshWrapperProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

const PullToRefreshWrapper: React.FC<PullToRefreshWrapperProps> = ({ onRefresh, children }) => {
  return (
    <PullToRefresh
      onRefresh={onRefresh}
      pullingContent={
        <PullIndicator>
          <Lottie animationData={animationData} loop autoplay style={{ width: 50, height: 50 }} />
          <div style={{ width: "32px" }} />
        </PullIndicator>
      }
      refreshingContent={
        <PullIndicator>
          <Lottie animationData={animationData} loop autoplay style={{ width: 50, height: 50 }} />
          <div style={{ width: "32px" }} />
        </PullIndicator>
      }
      resistance={3}
      maxPullDownDistance={300}
    >
      <div>{children}</div>
    </PullToRefresh>
  );
};

export default PullToRefreshWrapper;

const PullIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 0;
  // background-color: #FFBE00;
  width: 100%;
  max-width: 375px;
  max-height: 60px;
  margin: 0 auto;

  @media (min-width: 376px) {
    /* PC 환경에서는 375px 고정 */
    width: 375px;
  }
`;
