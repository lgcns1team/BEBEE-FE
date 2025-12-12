import styled from "styled-components";
import mypage1 from "../../../../assets/images/mypage-1.png";
import mypage2 from "../../../../assets/images/mypage-2.png";
import mypage3 from "../../../../assets/images/mypage-3.png";
import mypage4 from "../../../../assets/images/mypage-4.png";
const MENU_ITEMS = [
  {
    icon: mypage1,
    text: "활동 내역",
  },
  {
    icon: mypage2,
    text: "고객 센터",
  },
  {
    icon: mypage3,
    text: "공지사항",
  },
  {
    icon: mypage4,
    text: "자주 묻는 질문",
  },
];
const BottomMenuSection = () => {
  return (
    <MenuContainer>
      <MenuList>
        {MENU_ITEMS.map((item, index) => (
          <MenuItem key={index}>
            <MenuIconContainer>
              <MenuIcon src={item.icon} alt={item.text} />
            </MenuIconContainer>
            <MenuText>{item.text}</MenuText>
          </MenuItem>
        ))}
      </MenuList>
    </MenuContainer>
  );
};

export default BottomMenuSection;

const MenuContainer = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.white};
`;
const MenuList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  padding: 16px;
  gap: 16px;
`;

const MenuItem = styled.li`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
`;
const MenuIconContainer = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.color.natural100};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 0.5px solid ${({ theme }) => theme.color.natural100};
`;
const MenuIcon = styled.img`
  width: 24px;
  height: 24px;
  padding: 4px;
`;
const MenuText = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;
