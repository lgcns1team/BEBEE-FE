import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import type { ChatMessage } from "../types/chat.types";
import { useChatStore } from "../store/useChatStore";
import { getCurrentHoney } from "../../../api/walletApi";

interface PayReceiptProps {
  message: ChatMessage;
}

const PayReceipt = ({ message }: PayReceiptProps) => {
  const [currentHoney, setCurrentHoney] = useState<number | null>(null);
  const { chatroomId } = useParams<{ chatroomId: string }>();
  const getMessages = useChatStore((state) => state.getMessages);

  // walletApi에서 현재 꿀 가져오기
  useEffect(() => {
    const fetchCurrentHoney = async () => {
      try {
        const response = await getCurrentHoney();
        setCurrentHoney(response.currentHoney);
      } catch (error) {
        console.error("현재 꿀 조회 실패:", error);
      }
    };

    fetchCurrentHoney();
  }, []);

  // MATCH_CONFIRMATION 메시지에서 matchData 찾기 (MATCH_SUCCESS에는 matchData가 없음)
  const matchConfirmationMessage = chatroomId
    ? getMessages(chatroomId).find(
        (msg) => msg.type === "MATCH_CONFIRMATION" && msg.matchData
      )
    : null;

  const matchData = matchConfirmationMessage?.matchData;
  if (!matchData) {
    console.warn(
      "⚠️ [PayReceipt] matchData가 없습니다. MATCH_CONFIRMATION 메시지를 찾을 수 없습니다."
    );
    return null;
  }

  const unitHoney = matchData.unitHoney ?? 0;
  const totalHoney = matchData.totalHoney ?? 0;
  const matchType = matchData.type;
  const isVolunteer = matchData.isVolunteer ?? false;
  const createdAt = message.createdAt;

  const usedHoney = matchType === "DAY" ? unitHoney : totalHoney;

  // 사용된 꿀이 없으면 영수증 표시 안 함 (나눔은 표시)
  if (usedHoney === 0 && !isVolunteer) {
    return null;
  }

  return (
    <ReceiptContainer role="contentinfo" aria-label="꿀 사용 영수증">
      <ReceiptHeader>
        <ReceiptTitle>
          꿀 사용 영수증
          <span className="sr-only">
            매칭 성사로 인한 꿀 사용 내역 영수증입니다
          </span>
        </ReceiptTitle>
        <ReceiptSubtitle>
          꿀 사용 내역
          <span className="sr-only">
            아래에 사용된 꿀과 잔액 정보가 표시됩니다
          </span>
        </ReceiptSubtitle>
      </ReceiptHeader>
      <ReceiptDivider aria-hidden="true" />
      <ReceiptBody role="group" aria-label="꿀 사용 내역 상세">
        <ReceiptItem>
          <ItemLabel>사용액</ItemLabel>
          <ItemValue>
            {isVolunteer ? (
              <>
                나눔{" "}
                <span aria-hidden="true" role="img">
                  🩵
                </span>
                <span className="sr-only">나눔 서비스입니다</span>
              </>
            ) : (
              <>
                {usedHoney.toLocaleString()} 꿀
                <span className="sr-only">
                  사용된 꿀은 {usedHoney.toLocaleString()}꿀입니다
                </span>
              </>
            )}
          </ItemValue>
        </ReceiptItem>
        {currentHoney !== null && (
          <ReceiptItem>
            <ItemLabel>잔액</ItemLabel>
            <ItemValue>
              {currentHoney.toLocaleString()} 꿀
              <span className="sr-only">
                현재 보유 잔액은 {currentHoney.toLocaleString()}꿀입니다
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
          {createdAt
            ? new Date(createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "날짜 정보 없음"}
          <span className="sr-only">
            차감 일시:{" "}
            {createdAt
              ? new Date(createdAt).toLocaleDateString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "날짜 정보 없음"}
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
