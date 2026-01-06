//width 100%차지하는 긴 버튼 디자인 컴포넌트
import styled from "styled-components";

interface BaseButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

const BaseLongButton = ({ label, onClick, disabled }: BaseButtonProps) => {
  return (
    <ButtonArea>
      <StyledButton onClick={onClick} disabled={disabled}>
        {label}
      </StyledButton>
    </ButtonArea>
  );
};

export default BaseLongButton;

const ButtonArea = styled.div`
  width: 100%;
  padding-top: 16px;
  margin-top: auto;
  position: sticky;
  z-index: 800;
`;

const StyledButton = styled.button`
  width: 100%;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.color.natural200 : theme.color.main};
  color: ${({ theme, disabled }) =>
    disabled ? theme.color.subText3 : theme.color.white};
  padding: 14px 0;
  border: 1px solid
    ${({ theme, disabled }) =>
      disabled ? theme.color.natural200 : theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;

  &:active {
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.color.natural200 : theme.color.main};
  }

  &:hover {
    background-color: ${({ theme, disabled }) =>
      disabled
        ? theme.color.natural200
        : theme.color.mainDark};
  }
`;
