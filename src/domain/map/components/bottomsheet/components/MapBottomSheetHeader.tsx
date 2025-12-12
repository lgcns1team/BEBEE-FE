import React, { type FC } from "react";
import styled from "styled-components";

const MapBottomSheetHeader: FC = () => {
  return (
    <Wrapper>
      <Handle />
    </Wrapper>
  );
};

export default MapBottomSheetHeader;

const Wrapper = styled.div`
  height: 24px;
  border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
  position: relative;
  padding-top: 16px;
  padding-bottom: 4px;
  background-color: ${({ theme }) => theme.color.white};
`;

const Handle = styled.div`
  width: 34px;
  height: 4px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: #d0d0d0;
  margin: auto;
`;
