import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";
//
interface FilterProps {
  onClick: () => void;
}

const FilterButton = ({ onClick }: FilterProps) => {
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
  border: 0.5px solid ${({ theme }) => theme.color.natural200};

  background: ${({ theme }) => theme.color.white};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};

  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.color.subText3};
  }
`;

const ChevronDownIcon = styled(FiChevronDown)`
  color: ${({ theme }) => theme.color.text};
`;
