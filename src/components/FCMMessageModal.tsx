import { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useFCMMessageStore } from "../store/useFCMStore";
import { IoClose } from "react-icons/io5";

export const FCMMessageModal = () => {
  const { message, isOpen, closeMessage } = useFCMMessageStore();

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        closeMessage();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, closeMessage]);

  if (!message) return null;

  return (
    <ModalContainer $isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={closeMessage} aria-label="닫기">
          <IoClose size={20} />
        </CloseButton>
        <Title>{message.title}</Title>
        <Body>{message.body}</Body>
      </ModalContent>
    </ModalContainer>
  );
};
const slideDown = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ModalContainer = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  z-index: 10000;
  padding: 20px;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "auto" : "none")};
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;
  animation: ${slideDown} 0.3s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  transition: color 0.2s;
  z-index: 1;

  &:hover {
    color: #000;
  }

  &:active {
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
  padding-right: 32px;
  line-height: 1.4;
`;

const Body = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
  padding-right: 32px;
`;
