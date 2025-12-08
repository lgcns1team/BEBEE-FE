import styled from "styled-components";

const OneDayBadge = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  background: ${({ theme }) => theme.color.subColor2};
  padding: 4px 8px;
  border: 0.5px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.color.text};
`;

export default OneDayBadge;
