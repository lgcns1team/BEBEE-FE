import styled from "styled-components";

interface AuthRoleSelectButtonProps {
    role: "HELPER" | "DISABLED";
    label: string;
    selected: boolean;
    onClick: () => void;
}

const AuthRoleSelectButton = ({
    label,
    selected,
    onClick,
}: AuthRoleSelectButtonProps) => {
    return (
        <Button $selected={selected} onClick={onClick}>
            <ButtonContent>
                <RoleTitle>{label}</RoleTitle>
            </ButtonContent>
            <RadioButton $selected={selected} />
        </Button>
    );
};

export default AuthRoleSelectButton;

const Button = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 1rem;
  border: 0.5px solid
    ${({ $selected, theme }) =>
        $selected ? theme.color.main : theme.color.subText3};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ $selected, theme }) =>
        $selected ? theme.color.subColor2 : theme.color.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
`;

const RoleTitle = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;

const RadioButton = styled.div<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 0.5px solid
    ${({ $selected, theme }) =>
        $selected ? theme.color.main : theme.color.subText3};
  background-color: ${({ $selected, theme }) =>
        $selected ? theme.color.main : theme.color.white};
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.white};
    display: ${({ $selected }) => ($selected ? "block" : "none")};
    transition: opacity 0.2s ease;
  }
`;
