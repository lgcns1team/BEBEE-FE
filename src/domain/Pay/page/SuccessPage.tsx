// import { useEffect, useRef } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { confirmPayment } from "../../../api/paymentApi";

// export default function PaymentSuccessPage() {
//   const [params] = useSearchParams();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const paymentKey = params.get("paymentKey");
//     const orderId = params.get("orderId");
//     const amountStr = params.get("amount");

//     if (!paymentKey || !orderId || !amountStr) {
//       navigate("/payments/fail");
//       return;
//     }

//     const amount = Number(amountStr);
//     if (!Number.isFinite(amount)) {
//       navigate("/payments/fail");
//       return;
//     }

//     const dedupKey = `toss_confirmed:${orderId}:${paymentKey}`;
//     if (sessionStorage.getItem(dedupKey) === "1") {
//       return;
//     }
//     sessionStorage.setItem(dedupKey, "1");
//     (async () => {
//       try {
//         await confirmPayment({ paymentKey, orderId, amount });
//         alert("결제가 완료 되었습니다!!");
//         navigate("/mypage", { replace: true });
//       } catch (e) {
//         sessionStorage.removeItem(dedupKey);

//         console.log("status", e?.response?.status);
//         console.log("data", e?.response?.data);
//         console.error(e);
//         navigate("/payments/fail", { replace: true });
//       }
//     })();
//   }, [navigate, params]);

//   return <div style={{ padding: 16 }}>결제 승인 중...</div>;
// }

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../style/payStyle.css";
import { confirmPayment } from "../../../api/paymentApi";
type ConfirmResponse = {
  paymentKey: string;
  currentBalance?: number;
  paymentId: string;
};

export function SuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const paymentKey = params.get("paymentKey");
  const orderId = params.get("orderId");
  const amountStr = params.get("amount");

  const amount = useMemo(() => Number(amountStr), [amountStr]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmData, setConfirmData] = useState<ConfirmResponse | null>(null);
  useEffect(() => {
    if (!paymentKey || !orderId || !Number.isFinite(amount)) {
      navigate("/payments/fail", { replace: true });
    }
  }, [amount, amountStr, navigate, orderId, paymentKey]);

  async function handleConfirmPayment() {
    console.log("paymentkey: ", paymentKey);
    console.log("orderId", orderId);
    console.log("amount", amount);
    if (!paymentKey || !orderId || !Number.isFinite(amount)) return;
    if (isLoading) return;

    // 중복 승인 방지
    const dedupKey = `toss_confirmed:${orderId}:${paymentKey}`;
    if (sessionStorage.getItem(dedupKey) === "1") return;
    sessionStorage.setItem(dedupKey, "1");

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const data = (await confirmPayment({
        paymentKey,
        orderId,
        amount,
      })) as ConfirmResponse;

      setConfirmData(data);
      setIsConfirmed(true);
      alert("결제가 완료 되었습니다!");
      navigate("/mypage", { replace: true });
    } catch (e: any) {
      // 실패 시 재시도 가능하게 하기
      sessionStorage.removeItem(dedupKey);

      const msg =
        e?.response?.data?.message ?? e?.message ?? "결제 승인에 실패했어요";
      setErrorMsg(msg);

      console.log("status", e?.response?.status);
      console.log("data", e?.response?.data);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className="wrapper w-100">
      {isConfirmed ? (
        <div
          className="flex-column align-center confirm-success w-100 max-w-540"
          style={{ display: "flex" }}
        >
          <img
            src="https://static.toss.im/illusts/check-blue-spot-ending-frame.png"
            width="120"
            height="120"
            alt="success"
          />
          <h2 className="title">결제를 완료했어요</h2>

          <div className="response-section w-100">
            <div className="flex justify-between">
              <span className="response-label">결제 금액</span>
              <span className="response-text">{amount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span className="response-label">주문번호</span>
              <span className="response-text">{orderId}</span>
            </div>

            <div className="flex justify-between">
              <span className="response-label">paymentKey</span>
              <span className="response-text">{paymentKey}</span>
            </div>

            {confirmData?.paymentId && (
              <div className="flex justify-between">
                <span className="response-label">paymentId</span>
                <span className="response-text">{confirmData.paymentId}</span>
              </div>
            )}

            {typeof confirmData?.currentBalance === "number" && (
              <div className="flex justify-between">
                <span className="response-label">현재 잔액</span>
                <span className="response-text">
                  {confirmData.currentBalance.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div className="w-100 button-group">
            <div className="flex" style={{ gap: "16px" }}>
              <button className="btn w-100" onClick={() => navigate("/mypage")}>
                마이페이지로
              </button>
              <button className="btn w-100" onClick={() => navigate("/")}>
                홈으로
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-column align-center confirm-loading w-100 max-w-540">
          <div className="flex-column align-center">
            <img
              src="https://static.toss.im/lotties/loading-spot-apng.png"
              width="120"
              height="120"
              alt="loading"
            />
            <h2 className="title text-center">결제 요청까지 성공했어요.</h2>
            <h4 className="text-center description">
              결제 승인하고 완료해보세요.
            </h4>
          </div>

          {errorMsg && (
            <p style={{ marginTop: 12, color: "crimson" }}>{errorMsg}</p>
          )}

          <div className="w-100" style={{ marginTop: 12 }}>
            <button
              className="btn primary w-100"
              onClick={handleConfirmPayment}
              disabled={isLoading}
            >
              {isLoading ? "승인 처리중..." : "결제 승인하기"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
