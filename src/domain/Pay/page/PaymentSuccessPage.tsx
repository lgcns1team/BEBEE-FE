import { useEffect } from "react";
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

    (async () => {
      try {
        await confirmPayment({ paymentKey, orderId, amount });

        navigate("/mypage", { replace: true });
      } catch (e) {
        console.error(e);
        navigate("/payments/fail", { replace: true });
      }
    })();
  }, [navigate, params]);

  return <div style={{ padding: 16 }}>결제 승인 중...</div>;
}
