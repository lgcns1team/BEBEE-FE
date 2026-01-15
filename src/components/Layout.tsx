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
  height: 100dvh;
  display: flex;
  flex-direction: column;
  padding: 12px 14px;
  box-sizing: border-box;
  overflow: hidden;
  background-color: ${({ bg, theme }) =>
    bg ? theme.color.natural50 : theme.color.white};
  overscroll-behavior: none;
`;
export default Layout;
