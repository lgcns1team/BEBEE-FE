import React from "react";
import { BiMessageAltError } from "react-icons/bi";
import styled from "styled-components";

interface Props {
  onCancel: () => void;
  onConfirm: () => void;
}
const NoticeMessage = ({ onCancel, onConfirm }: Props) => {
  return (
    <Overlay>
      <Container>
        <BiMessageAltError size={110} color="#FB2C36" />
        <MessageSection>
          <ConfirmMessage>활동을 미완료 처리할까요?</ConfirmMessage>
          <InfoMessage>
            악의적인 미완료 처리는 사용이 정지될 수 있어요
          </InfoMessage>
        </MessageSection>
        <ButtonRow>
          <CancelButton onClick={onCancel}>
            <span>아니오</span>
          </CancelButton>
          <ConfirmButton onClick={onConfirm}>
            <span>네</span>
          </ConfirmButton>
        </ButtonRow>
      </Container>
    </Overlay>
  );
};

export default NoticeMessage;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;

  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 340px;
  height: 340px;
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MessageSection = styled.div`
  margin-top: 20px;
`;

const ConfirmMessage = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ theme }) => theme.weight.medium};
  text-align: center;
`;
const InfoMessage = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  text-align: center;
  padding-top: 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 60px;
`;

const CancelButton = styled.div`
  background: ${({ theme }) => theme.color.natural100};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  flex: 1;
  height: 40px;
  border: none;

  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: ${({ theme }) => theme.color.subText3};
    font-size: ${({ theme }) => theme.size.md};
  }
`;
const ConfirmButton = styled.div`
  background: ${({ theme }) => theme.color.main};
  flex: 1;
  height: 40px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    color: ${({ theme }) => theme.color.white};
    font-size: ${({ theme }) => theme.size.md};
  }
`;
