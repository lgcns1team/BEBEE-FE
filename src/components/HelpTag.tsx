// src/components/HelpTag/index.tsx
import styled from "styled-components";

const HelpTag = styled.span`
  padding: 4px 8px;
  font-size: ${({ theme }) => theme.size.sm};
  background-color: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

export default HelpTag;
