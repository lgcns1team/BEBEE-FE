//양옆 공간 고정 레이아웃 컴포넌트
//사용법: <Layout>자식컴포넌트</Layout> -> Header도 마진 설정 안해놨기 때문에 포함!
//<Layout><Header/></Layout> <Layout><어쩌구컴포넌트/></Layout> 구조도 가능
import type { ReactNode } from "react";
import styled from "styled-components";

interface LayoutProps {
  children: ReactNode;
}
const Layout = ({ children }: LayoutProps) => {
  return <Wrapper>{children}</Wrapper>;
};
const Wrapper = styled.div`
  width: 100%;
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
`;

export default Layout;
