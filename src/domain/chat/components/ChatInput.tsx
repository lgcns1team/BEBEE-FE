import React, { useState } from "react";
import styled from "styled-components";

interface Props {
  onSend: (text: string) => void;
}

const ChatInput = ({ onSend }: Props) => {
  const [text, setText] = useState("");

  const handleSend = () => {
    // 공백만 있는 경우 전송 방지
    if (!text.trim()) return;

    onSend(text);
    setText(""); // 전송 후 입력창 비우기
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 엔터 키를 눌렀을 때 (Shift+Enter 제외) 전송
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputArea>
      <StyledInput
        placeholder="메시지를 입력하세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      {/* 텍스트가 있을 때만 강조되도록 버튼 스타일링 가능 */}
      <SendButton onClick={handleSend} disabled={!text.trim()}>
        <SendIcon
          fill={text.trim() ? "#FFE600" : "#BEBEBE"}
          viewBox="0 0 24 24"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </SendIcon>
      </SendButton>
    </InputArea>
  );
};

export default ChatInput;

// --- Styled Components ---

const InputArea = styled.div`
  display: flex;
  align-items: center; // 수직 중앙 정렬 추가
  padding: 16px 0;
  background-color: white;
  border-top: 1px solid #ebebeb;
  position: fixed;
  width: 343px; // 제공해주신 너비 유지
  bottom: 0;
  left: 50%; // 화면 중앙 정렬을 위한 설정
  transform: translateX(-50%);
  z-index: 100;
  gap: 8px; // 인풋과 버튼 사이 간격
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  /* 테마 컬러가 없을 경우를 대비해 기본색(#F5F5F5)을 fallback으로 지정했습니다 */
  border: 1px solid ${({ theme }) => theme?.color?.natural100 || "#F5F5F5"};
  background-color: ${({ theme }) => theme?.color?.natural100 || "#F5F5F5"};
  font-size: 14px;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    background-color: #fff;
    border-color: #ccc;
  }

  &::placeholder {
    color: #bbb;
  }
`;

const SendButton = styled.button`
  padding: 0 5px;
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: default;
  }
`;

const SendIcon = styled.svg`
  width: 24px;
  height: 24px;
  transition: fill 0.2s ease;
`;
