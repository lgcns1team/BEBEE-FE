import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "홈", path: "/home", icon: IoHomeOutline },
    { label: "동네지도", path: "/map", icon: IoMapOutline },
    { label: "활동관리", path: "/engagements", icon: IoFolderOutline },
    { label: "채팅", path: "/chat", icon: IoChatbubbleOutline },
    { label: "나의비비", path: "/mypage", icon: IoPersonOutline },
  ];

  return (
    <NavContainer role="navigation" aria-label="하단 네비게이션 메뉴">
      <NavList role="list" aria-label="메인 메뉴 목록">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <NavItem
              key={item.path}
              $isActive={isActive}
              onClick={() => navigate(item.path)}
              role="listitem"
              aria-label={
                isActive ? `현재 ${item.label} 페이지` : `${item.label}로 이동`
              }
              aria-current={isActive ? "page" : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(item.path);
                }
              }}
            >
              <NavIcon aria-hidden="true">
                <Icon />
              </NavIcon>
              <NavLabel aria-hidden="true">{item.label}</NavLabel>
              <span className="sr-only">
                {isActive
                  ? `현재 ${item.label} 페이지입니다`
                  : `${item.label}로 이동합니다. Enter 키 또는 Space 키를 누르면 실행됩니다.`}
              </span>
            </NavItem>
          );
        })}
      </NavList>
    </NavContainer>
  );
};

import {
  IoHomeOutline,
  // IoMapOutline,
  IoChatbubbleOutline,
  IoPersonOutline,
  IoFolderOutline,
  IoMapOutline,
} from "react-icons/io5";

const NavContainer = styled.div`
  position: fixed;
  width: 375px;
  transform: translateX(-50%);
  left: 50%;
  bottom: 0;
  height: 60px;
  background: white;
`;

const NavList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 10px 20px;
`;

const NavItem = styled.button<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.color.text : theme.color.subText3};
  transition: color 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const NavIcon = styled.div`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavLabel = styled.span`
  font-size: ${({ theme }) => theme.size.sm};

  white-space: nowrap;
`;

export default NavBar;
