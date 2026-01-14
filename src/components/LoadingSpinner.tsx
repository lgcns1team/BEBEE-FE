import React from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import animationData from "../assets/lotties/loading-spinner.json";

const LoadingSpinner = () => {
  return (
    <Container>
      <Lottie animationData={animationData} loop autoplay style={{ width: 60, height: 60 }} />{" "}
    </Container>
  );
};

export default LoadingSpinner;

const Container = styled.div`
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding-right: 3rem;
`;
