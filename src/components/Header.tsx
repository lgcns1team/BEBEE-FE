import styled from "styled-components";
import { IoChevronBack } from "react-icons/io5";

interface HeaderProps {
  title: string;
  onBack?: () => void;
  rightElement?: React.ReactNode;
}

const Header = ({ title, onBack, rightElement }: HeaderProps) => {
  return (
    <Container>
      <Left onClick={onBack}>
        <IoChevronBack size={25} />
      </Left>

      <Title>{title}</Title>

      <Right>{rightElement}</Right>
    </Container>
  );
};

export default Header;

const Container = styled.header`
  width: 100%;
  height: 73px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 20px;
`;

const Left = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text};
`;

const Title = styled.h1`
  flex: 1;
  text-align: center;
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: 600;
  color: #1c1c1c;
`;

const Right = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;
