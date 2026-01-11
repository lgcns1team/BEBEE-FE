import React from "react";
import styled from "styled-components";
import type { ChatMessage } from "../types/chat.types";

interface PayReceiptProps {
  message: ChatMessage;
}

const PayReceipt = ({ message }: PayReceiptProps) => {
  const match = message.matchData;
  if (!match) return null;
  const isVolunteer = message.isVolunteer ?? false;
  const matchType = match.type;
  const unitPoints = match.unitHoney ?? 0;
  const totalPoints = match.totalHoney ?? 0;

  // DAY면 unitPoints, 아니면 totalPoints 사용 (매칭확인서 작성 시 입력한 값)
  const usedHoney = matchType === "DAY" ? unitPoints : totalPoints;

  // 나눔이거나 사용된 꿀이 없으면 영수증 표시 안 함
  if (isVolunteer || usedHoney === 0) {
    return null;
  }

  return (
    <ReceiptContainer role="contentinfo" aria-label="꿀 사용 영수증">
      <ReceiptHeader>
        <ReceiptTitle>
          꿀 사용 영수증
          <span className="sr-only">매칭 성사로 인한 꿀 사용 내역 영수증입니다</span>
        </ReceiptTitle>
        <ReceiptSubtitle>
          꿀 사용 내역
          <span className="sr-only">아래에 사용된 꿀과 잔액 정보가 표시됩니다</span>
        </ReceiptSubtitle>
      </ReceiptHeader>
      <ReceiptDivider aria-hidden="true" />
      <ReceiptBody role="group" aria-label="꿀 사용 내역 상세">
        <ReceiptItem>
          <ItemLabel>사용액</ItemLabel>
          <ItemValue>
            {usedHoney.toLocaleString()} 꿀
            <span className="sr-only">
              사용된 꿀은 {usedHoney.toLocaleString()}꿀입니다
            </span>
          </ItemValue>
        </ReceiptItem>
        {message.currentHoney !== undefined && (
          <ReceiptItem>
            <ItemLabel>잔액</ItemLabel>
            <ItemValue>
              {message.currentHoney.toLocaleString()} 꿀
              <span className="sr-only">
                현재 보유 잔액은 {message.currentHoney.toLocaleString()}꿀입니다
              </span>
            </ItemValue>
          </ReceiptItem>
        )}
      </ReceiptBody>
      <ReceiptDivider aria-hidden="true" />
      <ReceiptFooter>
        <FooterText>
          매칭이 성사되어 꿀이 차감되었어요
          <span className="sr-only">
            매칭이 성사되어 위의 금액만큼 꿀이 차감되었습니다
          </span>
        </FooterText>
        <FooterDate>
          {new Date(message.createdAt).toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          <span className="sr-only">
            차감 일시:{" "}
            {new Date(message.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </FooterDate>
      </ReceiptFooter>
    </ReceiptContainer>
  );
};

export default PayReceipt;

const ReceiptContainer = styled.div`
  width: 100%;
  margin-top: 16px;
  background: ${({ theme }) => theme.color.white};
  border: 1px solid ${({ theme }) => theme.color.natural200};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
`;

const ReceiptHeader = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const ReceiptTitle = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 4px;
  letter-spacing: -0.5px;
`;

const ReceiptSubtitle = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const ReceiptDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.color.natural200};
  margin: 12px 0;
`;

const ReceiptBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 12px;
`;

const ReceiptItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
`;

const ItemLabel = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const ItemValue = styled.span`
  font-size: ${({ theme }) => theme.size.md};

  color: ${({ theme }) => theme.color.text};
`;

const ReceiptFooter = styled.div`
  text-align: center;
  padding-top: 12px;
`;

const FooterText = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  margin-bottom: 8px;
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const FooterDate = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  font-weight: ${({ theme }) => theme.weight.regular};
`;
