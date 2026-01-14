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
  align-items: center;

  /* 핵심 변경 사항 */
  position: relative; /* fixed 대신 레이아웃 흐름에 맞춤 */
  width: 100%; /* 고정 너비보다는 100%로 대응하고 필요시 부모에서 제어 */
  bottom: 0;
  left: 0;
  transform: none;

  /* 하단 세이프 에어리어 대응 */
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom)) 16px;

  background-color: white;
  border-top: 1px solid #ebebeb;
  z-index: 100;
  gap: 8px;
  flex-shrink: 0; /* 부모 flex 컨테이너 안에서 크기가 줄어들지 않도록 */
`;

const StyledInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.color.natural100};
  background-color: ${({ theme }) => theme.color.natural100};

  /* iOS 자동 줌 방지: 최소 16px 권장 */
  font-size: 16px;

  outline: none;
  -webkit-appearance: none; /* iOS 기본 스타일 제거 */

  &:focus {
    background-color: #fff;
    border-color: ${({ theme }) => theme.color.main}; /* 테마 컬러 활용 */
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
