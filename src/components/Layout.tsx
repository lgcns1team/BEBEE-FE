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
  /* 상단 노치 영역과 하단 홈 바 영역 대응 */
  padding: env(safe-area-inset-top) 16px env(safe-area-inset-bottom) 16px;
  box-sizing: border-box;
  /* 전체 페이지 스크롤 방지 (중요!) */
  overflow: hidden;
  background-color: ${({ bg, theme }) =>
    bg ? theme.color.natural50 : theme.color.white};
  /* 아이폰 PWA에서 터치로 인한 화면 꿀렁임 방지 */
  overscroll-behavior: none;
  padding-bottom: calc(60px + env(safe-area-inset-bottom));
`;
export default Layout;
