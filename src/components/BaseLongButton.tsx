//width 100%차지하는 긴 버튼 디자인 컴포넌트
import styled from "styled-components";

interface BaseButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

const BaseLongButton = ({ label, onClick, disabled }: BaseButtonProps) => {
  return (
    <StyledButton onClick={onClick} disabled={disabled}>
      {label}
    </StyledButton>
  );
};

const StyledButton = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.color.main};
  color: ${({ theme }) => theme.color.white};
  padding: 14px 0;
  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  cursor: pointer;
  margin-top: 1.5rem;
  &:active {
    background-color: ${({ theme }) => theme.color.main};
  }
`;

export default BaseLongButton;
