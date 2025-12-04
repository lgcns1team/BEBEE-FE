import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";

interface Props {
  onClick: () => void;
}

const FilterButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick}>
      <span>필터</span>
      <ChevronDownIcon size={16} />
    </Button>
  );
};

export default FilterButton;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid #dcdcdc;

  background: #ffffff;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};

  cursor: pointer;

  &:active {
    background: #f3f3f3;
  }
`;

const ChevronDownIcon = styled(FiChevronDown)`
  color: ${({ theme }) => theme.color.text};
`;
