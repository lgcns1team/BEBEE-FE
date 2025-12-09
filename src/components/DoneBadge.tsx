import styled from "styled-components";

const DoneBadge = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  padding: 3px 7px;
  color: ${({ theme }) => theme.color.red500};
  border: 0.5px solid ${({ theme }) => theme.color.red500};
  background-color: ${({ theme }) => theme.color.red50};
  border-radius: ${({ theme }) => theme.borderRadius.xsm};
`;

export default DoneBadge;
