import styled from "styled-components";

interface InputProps {
  inputLabel?: string;
  infoText?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const Input = ({
  inputLabel,
  infoText,
  disabled,
  value,
  onChange,
  required,
}: InputProps) => {
  return (
    <FieldSet>
      {inputLabel && (
        <InputLabel>
          {inputLabel}
          {required && <RequiredMark>*</RequiredMark>}
          {infoText && <InfoText>{infoText}</InfoText>}
        </InputLabel>
      )}
      <InputBox disabled={disabled} value={value} onChange={onChange} />
    </FieldSet>
  );
};

export default Input;

const FieldSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;

const RequiredMark = styled.span`
  margin-left: 4px;
  color: ${({ theme }) => theme.color.red500};
`;

const InputBox = styled.input<{ disabled?: boolean }>`
  width: 100%;
  font-size: ${({ theme }) => theme.size.md};
  padding: 1rem;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: 8px;
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.color.natural100 : theme.color.white};
  color: ${({ theme }) => theme.color.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.main};
  }
`;

const InfoText = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  font-weight: ${({ theme }) => theme.weight.regular};
  margin: 0;
`;
