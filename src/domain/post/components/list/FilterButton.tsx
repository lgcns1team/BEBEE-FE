import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";

interface Props {
  onClick: () => void;
}

const FilterButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick}>
      <span>필터</span>
      <FiChevronDown size={16} color="var(--text)" />
    </Button>
  );
};

export default FilterButton;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 14px;
  border-radius: 12px;
  border: 1px solid #dcdcdc;

  background: #ffffff;
  font-size: 14px;
  color: var(--text);

  cursor: pointer;

  &:active {
    background: #f3f3f3;
  }
`;
