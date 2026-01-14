import styled from "styled-components";
export const Natural50 = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.natural50};
  gap: 16px;
  overflow-y: auto;
`;

export const ResumContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const ResumeItem = styled.div`
  display: flex;
  align-items: flex-start;
  &:last-child {
    border-bottom: none;
  }
`;

export const Indicator = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.natural200};
  margin-right: 16px;
  margin-top: 8px;
  flex-shrink: 0;
`;

export const ResumeContent = styled.div`
  flex: 1;
`;

export const ResumeYear = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  margin-bottom: 4px;
`;

export const ResumeTitle = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  font-weight: 500;
`;
