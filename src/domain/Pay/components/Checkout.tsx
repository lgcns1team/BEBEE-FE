import { useEffect, useRef } from "react";
import {
  loadPaymentWidget,
  type PaymentWidgetInstance,
} from "@tosspayments/payment-widget-sdk";
import { useUserStore } from "../../../store/useUserStore";
import { useLocation } from "react-router-dom";

type CheckoutState = {
  orderId: string;
  amount: number;
  honey: number;
};

export default function Checkout() {
  const memberId = useUserStore((s) => s.user.memberId);
  const location = useLocation();
  const clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY;
  const customerKey = String(memberId);
  const state = location.state as CheckoutState;
  const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);

  useEffect(() => {
    (async () => {
      const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

      paymentWidget.renderPaymentMethods("#payment-widget", {
        value: state.amount,
      });
      paymentWidgetRef.current = paymentWidget;
    })();
  }, [clientKey, customerKey, state]);

  const handleRequestPayment = async () => {
    const paymentWidget = paymentWidgetRef.current;

    const origin = window.location.origin;

    try {
      await paymentWidget.requestPayment({
        orderId: state.orderId,
        orderName: `꿀 충전 ${state.honey}꿀`,
        successUrl: `${origin}/payments/success`,
        failUrl: `${origin}/payments/fail`,
      });
    } catch (e) {
      console.log(e);
      alert("결제 요청에 실패했어요.");
    }
  };

  return (
    <div className="App">
      <h1>꿀 결제하기</h1>

      <p>
        {state.honey.toLocaleString()}꿀 / {state.amount.toLocaleString()}원
      </p>
      <div id="payment-widget" />
      <button onClick={handleRequestPayment}>결제하기</button>
    </div>
  );
}
