import React from "react";
import TestBasePage from "./TestBasePage";
import MapBottomSheet from "../components/bottomsheet/components/MapBottomSheet";

import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import styled from "styled-components";

const pxToRem = (px: number) => `${px / 16}rem`;
const HEADER_HEIGHT_REM = pxToRem(73);

const MapPage = () => {
  const navigate = useNavigate();
  return (
    <Container>
      <HeaderWrapper>
        <Header title="동네지도" onBack={() => navigate(-1)} />
      </HeaderWrapper>
      <Content>
        <TestBasePage />
      </Content>

      <MapBottomSheet />
    </Container>
  );
};

export default MapPage;

const Container = styled.div`
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const HeaderWrapper = styled.div`
  width: 100%;
  padding: 0 16px;
  box-sizing: border-box;
  height: ${HEADER_HEIGHT_REM};
`;

const Content = styled.div`
  position: absolute;
  top: ${HEADER_HEIGHT_REM};
  left: 0;
  width: 100%;
  height: calc(100vh - ${HEADER_HEIGHT_REM});
`;
