//props으로 bg 넘기면 natural50 배경색 적용
import type { ReactNode } from "react";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
  bg?: boolean;
}

const Layout = ({ children, bg }: LayoutProps) => {
  return <Wrapper bg={bg}>{children}</Wrapper>;
};

const Wrapper = styled.main<{ bg?: boolean }>`
  width: 100%;
  max-width: 100%;
  height: calc(var(--vh, 1vh) * 100); /* Mobile viewport fix */
  max-height: calc(var(--vh, 1vh) * 100); /* Mobile viewport fix */
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: ${({ bg, theme }) =>
    bg ? theme.color.natural50 : theme.color.white};
`;

export default Layout;
