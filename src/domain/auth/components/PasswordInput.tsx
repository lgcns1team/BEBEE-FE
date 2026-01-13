import { useState } from "react";
import styled from "styled-components";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import BaseInput from "../../../components/BaseInput";
import { InputWrapper } from "../../../styles/inputStyles";

interface PasswordInputProps {
    inputLabel?: string;
    infoText?: string;
    disabled?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClick?: () => void;
    required?: boolean;
    placeholder?: string;
}

const PasswordInput = ({
    inputLabel,
    infoText,
    value,
    onChange,
    onClick,
    ...rest
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <BaseInput label={inputLabel} infoText={infoText} {...rest}>
            <InputWrapper>
                <StyledInput
                    type={showPassword ? "text" : "password"}
                    value={value}
                    onChange={onChange}
                    onClick={onClick}
                    {...rest}
                />
                <ToggleButton
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? (
                        <IoEyeOffOutline size={20} />
                    ) : (
                        <IoEyeOutline size={20} />
                    )}
                </ToggleButton>
            </InputWrapper>
        </BaseInput>
    );
};

export default PasswordInput;

const StyledInput = styled.input<{ disabled?: boolean }>`
  width: 100%;
  font-size: ${({ theme }) => theme.size.md};
  padding: 1rem;
  padding-right: 3rem;
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

const ToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.subText2};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  
  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`;
