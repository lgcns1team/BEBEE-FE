import styled from "styled-components";
export const FieldSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; // label과 input/select 사이 간격
  margin-top: 2.5rem; // 세트 간 마진
`;

export const ModalLabel = styled.label`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
`;
export const RequiredMark = styled.span`
  margin-left: 4px;
  color: ${({ theme }) => theme.color.red500};
`;

export const ModalInput = styled.input<{ $editable?: boolean }>`
  width: 100%;
  font-size: ${({ theme }) => theme.size.md};
  padding: 1rem;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: 8px;
  background-color: ${({ $editable, theme }) =>
    $editable ? theme.color.white : theme.color.natural100};
  color: ${({ theme }) => theme.color.text};

  &:focus {
    outline: none; // 기본 파란 테두리 제거
    border-color: ${({ theme }) => theme.color.main}; // 포커스 테두리 색
  }
`;
