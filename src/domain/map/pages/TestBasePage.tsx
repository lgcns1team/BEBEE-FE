import React from "react";
import styled from "styled-components";
import TestImage from "../components/images/test.png";

const pxToRem = (px: number) => `${px / 16}rem`; // 변환 함수

// Header 실제 높이(px 기반) → rem 변환
const HEADER_HEIGHT_REM = pxToRem(73);

const TestBasePage = () => {
  return <Image src={TestImage} />;
};

const Image = styled.img`
  width: 100%;

  /* 헤더를 제외한 전체 화면 채우기 */
  height: calc(100vh - ${HEADER_HEIGHT_REM});

  object-fit: cover;
  object-position: center;
  display: block;
`;

export default TestBasePage;
