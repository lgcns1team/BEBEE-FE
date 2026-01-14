import styled from "styled-components";
import { FiChevronDown } from "react-icons/fi";
//
interface FilterProps {
  onClick: () => void;
  isActive?: boolean;
}

const FilterButton = ({ onClick, isActive = false }: FilterProps) => {
  return (
    <Button onClick={onClick} $isActive={isActive}>
      <span>필터</span>
      <ChevronDownIcon size={16} $isActive={isActive} />
    </Button>
  );
};

export default FilterButton;

const Button = styled.button<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;

  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 0.5px solid
    ${({ $isActive, theme }) =>
      $isActive ? "#000000" : theme.color.natural200};

  background-color: ${({ $isActive }) => ($isActive ? "black" : "white")};

  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ $isActive }) => ($isActive ? "white" : "inherit")};

  cursor: pointer;

  &:active {
    background: ${({ theme }) => theme.color.subText3};
  }
`;

const ChevronDownIcon = styled(FiChevronDown)<{ $isActive?: boolean }>`
  color: ${({ $isActive }) => ($isActive ? "white" : "inherit")};
`;
