/*뒤로가기 아이콘은 무조건 있음
더보기 ? showRight : 없음
onRightClick ? 더보기 클릭시 실행할 함수 : 없음

# 사용 예시
<Header
  title="내 프로필"
  onBack={() => navigate(-1)}
  showRight
  onRightClick={() => setOpen(true)}
/>
*/

import styled from "styled-components";
import { IoChevronBack } from "react-icons/io5";
import { FiMoreVertical } from "react-icons/fi";

interface HeaderProps {
  title?: string;
  subTitle?: string;
  onBack: () => void;
  onRightClick?: () => void;
  showRight?: boolean;
}

const Header = ({
  title,
  subTitle,
  onBack,
  onRightClick,
  showRight,
}: HeaderProps) => {
  return (
    <Container>
      {/* 왼쪽: 항상 노출 */}
      <Left onClick={onBack}>
        <IoChevronBack size={25} />
      </Left>

      {/* 타이틀 영역 */}
      {(title || subTitle) && (
        <HeaderTitleBox>
          {title && <Title>{title}</Title>}
          {subTitle && <SubTitle>{subTitle}</SubTitle>}
        </HeaderTitleBox>
      )}

      {/* 더보기 필요할 때만*/}
      {showRight && (
        <Right onClick={onRightClick}>
          <FiMoreVertical size={25} />
        </Right>
      )}
    </Container>
  );
};

export default Header;

// ---------- styled ----------
const Container = styled.header`
  width: 100%;
  height: 73px;
  display: flex;
  align-items: center;
  position: sticky;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
  z-index: 800;
`;

const Left = styled.div`
  position: absolute;
  left: 0;
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text};
`;

const Right = styled.div`
  position: absolute;
  right: 0;
  height: 30px;
  width: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  cursor: pointer;
`;

const HeaderTitleBox = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  margin: 0;
`;

const SubTitle = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  background-color: ${({ theme }) => theme.color.subColor2};
  color: ${({ theme }) => theme.color.main};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 0.5px solid ${({ theme }) => theme.color.main};
  margin: 0;
`;
