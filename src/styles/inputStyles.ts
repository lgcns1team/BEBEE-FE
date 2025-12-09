/*input 스타일 통일 스타일 파일*/

import styled from "styled-components";

export const FieldSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2.5rem;
`;

export const InputLabel = styled.label`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;

export const RequiredMark = styled.span`
  margin-left: 4px;
  color: ${({ theme }) => theme.color.red500};
`;

export const InputBox = styled.input<{ disabled?: boolean }>`
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

export const InfoText = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  font-weight: ${({ theme }) => theme.weight.regular};
  margin: 0;
`;

export const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;
export const LocationInputWrapper = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-left: 3rem;
  }
`;

export const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.color.subText2};
  display: flex;
  align-items: center;
`;
