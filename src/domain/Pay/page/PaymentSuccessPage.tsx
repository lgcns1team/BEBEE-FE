import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { confirmPayment } from "../../../api/paymentApi";

export default function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const paymentKey = params.get("paymentKey");
    const orderId = params.get("orderId");
    const amountStr = params.get("amount");

    if (!paymentKey || !orderId || !amountStr) {
      navigate("/payments/fail");
      return;
    }

    const amount = Number(amountStr);
    if (!Number.isFinite(amount)) {
      navigate("/payments/fail");
      return;
    }

    const dedupKey = `toss_confirmed:${orderId}:${paymentKey}`;
    if (sessionStorage.getItem(dedupKey) === "1") {
      return;
    }
    sessionStorage.setItem(dedupKey, "1");
    (async () => {
      try {
        await confirmPayment({ paymentKey, orderId, amount });
        alert("결제가 완료 되었습니다!!");
        navigate("/mypage", { replace: true });
      } catch (e) {
        sessionStorage.removeItem(dedupKey);

        console.log("status", e?.response?.status);
        console.log("data", e?.response?.data);
        console.error(e);
        navigate("/payments/fail", { replace: true });
      }
    })();
  }, [navigate, params]);

  return <div style={{ padding: 16 }}>결제 승인 중...</div>;
}
