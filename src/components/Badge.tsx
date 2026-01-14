import styled from "styled-components";

interface BadgeProps {
  $active?: boolean;
}

const Badge = styled.button<BadgeProps>`
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background-color: ${({ $active, theme }) =>
    $active ? theme.color.subColor2 : theme.color.natural50};

  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.subText2};

  border: 0.5px solid
    ${({ $active, theme }) =>
      $active ? theme.color.main : theme.color.natural50};

  font-size: ${({ theme }) => theme.size.sm};

  appearance: none;
  outline: none;
  -webkit-tap-highlight-color: transparent;
`;

export default Badge;
