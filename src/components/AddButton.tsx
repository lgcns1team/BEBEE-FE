import styled from "styled-components";
import { IoIosAdd } from "react-icons/io";

interface AddButtonProps {
  onClick?: () => void;
}
const AddButton = ({ onClick }: AddButtonProps) => {
  return (
    <Wrapper>
      <Button onClick={onClick}>
        <IconWrapper>
          <IoIosAdd size={24} color="#737373" />
        </IconWrapper>
        추가하기
      </Button>
    </Wrapper>
  );
};

export default AddButton;

const Wrapper = styled.div`
  width: 100%;
`;
const IconWrapper = styled.div`
  width: 26px;
  height: 26px;
  background-color: #fafafa;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Button = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: none;
  color: ${({ theme }) => theme.color.subText2};
  font-size: ${({ theme }) => theme.size.md};
  background-color: ${({ theme }) => theme.color.white};
  gap: 10px;
`;
