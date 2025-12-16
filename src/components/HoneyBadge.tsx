import styled from "styled-components";

const HoneyBadge = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  padding: 3px 7px;
  color: ${({ theme }) => theme.color.main};
  border: 0.5px solid ${({ theme }) => theme.color.main};
  background-color: ${({ theme }) => theme.color.subColor2};
  border-radius: 30px;
`;

export default HoneyBadge;
