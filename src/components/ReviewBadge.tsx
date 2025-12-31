import styled from "styled-components";

const ReviewBadge = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  background: ${({ theme }) => theme.color.natural100};
  color: ${({ theme }) => theme.color.text};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  width: fit-content;
  white-space: nowrap;
`;
export default ReviewBadge;
