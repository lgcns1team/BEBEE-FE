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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한국어 입력(IME) 조합 중일 때는 전송하지 않음
    // compositionstart/compositionend 이벤트로 확인하거나
    // isComposing 속성으로 확인
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      // IME 조합 중이 아니고, 조합이 끝났을 때만 전송
      if (!e.nativeEvent.isComposing) {
        handleSend();
      }
    }
  };

  return (
    <InputArea role="region" aria-label="메시지 입력 영역">
      <span className="sr-only">채팅 메시지를 입력하는 영역입니다</span>
      <StyledInput
        placeholder="메시지를 입력하세요..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        aria-label="메시지 입력 필드"
      />
      {/* 텍스트가 있을 때만 강조되도록 버튼 스타일링 가능 */}
      <SendButton
        onClick={handleSend}
        disabled={!text.trim()}
        aria-label={
          text.trim()
            ? "메시지 전송하기"
            : "메시지 전송하기 (메시지를 입력해주세요)"
        }
      >
        <SendIcon
          fill={text.trim() ? "#FFBE00" : "#BEBEBE"}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
        </SendIcon>
        <span className="sr-only">
          {text.trim()
            ? "입력한 메시지를 전송합니다. Enter 키 또는 Space 키를 누르면 실행됩니다."
            : "메시지를 입력하면 전송할 수 있습니다."}
        </span>
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
  border: 1px solid ${({ theme }) => theme.color.natural100};
  background-color: ${({ theme }) => theme.color.natural100};
  font-size: ${({ theme }) => theme.size.md};
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
