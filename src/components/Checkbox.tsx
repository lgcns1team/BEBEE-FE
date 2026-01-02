import React from "react";
import styled from "styled-components";
import { RiCheckLine } from "react-icons/ri";

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
};

const CheckBoxWrapper = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  margin-left: auto;

  span {
    font-size: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.subText2};
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  display: none;
`;

const CustomCheckbox = styled.div<{ $checked: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 0.5px solid
    ${({ theme, $checked }) =>
      $checked ? theme.color.main : theme.color.subText3};

  background: ${({ theme, $checked }) =>
    $checked ? theme.color.main : theme.color.white};

  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.color.white};
  transition: 0.15s ease-in-out;
`;

export const Checkbox = ({
  checked,
  onChange,
  label = "완료 제외",
}: CheckboxProps) => {
  return (
    <CheckBoxWrapper>
      <HiddenCheckbox
        checked={checked}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.checked)
        }
      />

      <CustomCheckbox $checked={checked}>
        {checked && <RiCheckLine size={14} />}
      </CustomCheckbox>

      {label && <span>{label}</span>}
    </CheckBoxWrapper>
  );
};
