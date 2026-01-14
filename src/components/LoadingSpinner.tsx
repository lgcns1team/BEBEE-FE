import React from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import animationData from "../assets/lotties/loading-spinner.json";

const LoadingSpinner = () => {
  return (
    <Container>
      <Lottie animationData={animationData} loop autoplay style={{ width: 100, height: 100 }} />{" "}
    </Container>
  );
};

export default LoadingSpinner;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;
