import styled from "styled-components";

interface Props {
  active: "week" | "month";
  onChange: (value: "week" | "month") => void;
}

const PeriodToggle = ({ active, onChange }: Props) => {
  return (
    <Wrapper>
      <ToggleButton
        $active={active === "week"}
        position="left"
        onClick={() => onChange("week")}
      >
        한 주 보기
      </ToggleButton>
      <ToggleButton
        $active={active === "month"}
        position="right"
        onClick={() => onChange("month")}
      >
        한 달 보기
      </ToggleButton>
    </Wrapper>
  );
};

export default PeriodToggle;

/* ---------------- styled ---------------- */

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  height: 24px;
  margin-left: 197px;
  margin-bottom: 15px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const ToggleButton = styled.button<{
  $active: boolean;
  position: "left" | "right";
}>`
  padding: 0 12px;
  height: 100%;
  font-size: ${({ theme }) => theme.size.sm};
  cursor: pointer;
  white-space: nowrap;
  position: relative;

  /* 배경색 */
  background: ${({ $active, theme }) =>
    $active ? theme.color.subColor2 : theme.color.white};

  /* 텍스트 색상 */
  color: ${({ $active, theme }) =>
    $active ? theme.color.main : theme.color.subText2};

  border: none;
  border-radius: ${({ position }) =>
    position === "left" ? "999px 0 0 999px" : "0 999px 999px 0"};

  /* 왼쪽 버튼 */
  ${({ position, $active, theme }) =>
    position === "left" &&
    `
    /* 왼쪽 border - 활성화 시 main, 비활성화 시 subText2 */
    border-left: 0.5px solid ${
      $active ? theme.color.main : theme.color.subText2
    };
    border-top: 0.5px solid ${
      $active ? theme.color.main : theme.color.subText2
    };
    border-bottom: 0.5px solid ${
      $active ? theme.color.main : theme.color.subText2
    };
    
    /* 가운데 border - 활성화 시에만 표시 */
    ${
      $active
        ? `
      &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 0.5px;
        background: ${theme.color.main};
      }
    `
        : ""
    }
  `}

  /* 오른쪽 버튼 */
  ${({ position, $active, theme }) =>
    position === "right" &&
    `
    /* 오른쪽 border - 활성화 시 main, 비활성화 시 subText2 */
    border-right: 0.5px solid ${
      $active ? theme.color.main : theme.color.subText2
    };
    border-top: 0.5px solid ${
      $active ? theme.color.main : theme.color.subText2
    };
    border-bottom: 0.5px solid ${
      $active ? theme.color.main : theme.color.subText2
    };
    
    /* 가운데 border - 활성화 시에만 표시 */
    ${
      $active
        ? `
      &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        width: 0.5px;
        background: ${theme.color.main};
      }
    `
        : ""
    }
  `}

  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
`;
