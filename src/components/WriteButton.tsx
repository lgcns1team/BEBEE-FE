import styled from "styled-components";
import { IoAdd } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const WriteButton = () => {
  const navigate = useNavigate();
  const goWritePage = () => {
    navigate("");
  };
  return (
    <Button>
      <ButtonInner>
        <IoAdd size={20} onClick={goWritePage} />
        <span>글쓰기</span>
      </ButtonInner>
    </Button>
  );
};

export default WriteButton;

const Button = styled.button`
  position: fixed;
  bottom: 90px;
  right: 50%;
  transform: translateX(170px); /* 430px / 2 → 오른쪽 끝 */
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  width: 90px;
  height: 45px;
  border-radius: 50px;
  border: none;
  background-color: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};

  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  cursor: pointer;
`;
const ButtonInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
