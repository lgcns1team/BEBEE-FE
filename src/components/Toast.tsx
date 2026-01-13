import styled, { keyframes, css } from "styled-components";
import { useToastStore } from "../store/useToastStore";
import { GoCheckCircleFill } from "react-icons/go";
import { GoAlertFill } from "react-icons/go"; // 아이콘 예시

interface ToastProps {
  position?: "top" | "bottom";
}

export const Toast = (
  { position = "bottom" }: ToastProps = {} as ToastProps
) => {
  const { message, type } = useToastStore();

  if (!message) return null;

  return (
    <ToastContainer $type={type} $position={position}>
      {type === "SUCCESS" ? (
        <GoCheckCircleFill color="#155DFC" />
      ) : (
        <GoAlertFill color="#FFEE00" />
      )}
      <ToastMessage>{message}</ToastMessage>
    </ToastContainer>
  );
};

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translate(-50%, 20px); }
  15% { opacity: 1; transform: translate(-50%, 0); }
  85% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, -20px); }
`;

const ToastContainer = styled.div<{
  $type: "SUCCESS" | "ERROR";
  $position: "top" | "bottom";
}>`
  position: fixed;
  ${({ $position }) => ($position === "top" ? "top: 120px;" : "bottom: 120px;")}
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;

  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 280px;
  padding: 14px 20px;
  border-radius: 12px;
  box-shadow: 0 8px 24px ${({ theme }) => theme.color.natural200};

  animation: ${fadeInOut} 2.5s ease-in-out forwards;

  /* 타입에 따른 색상 분기 */
  ${({ $type, theme }) =>
    $type === "SUCCESS"
      ? css`
          background-color: ${theme.color.blue50};
        `
      : css`
          background-color: ${theme.color.subColor2};
        `}
`;

const ToastMessage = styled.span`
  color: ${({ theme }) => theme.color.text};
  font-size: 14px;
  font-weight: 500;
`;
