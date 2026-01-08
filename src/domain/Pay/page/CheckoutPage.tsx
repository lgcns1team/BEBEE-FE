// import { useEffect, useRef } from "react";
// import {
//   loadPaymentWidget,
//   type PaymentWidgetInstance,
// } from "@tosspayments/payment-widget-sdk";
// import { useUserStore } from "../../../store/useUserStore";
// import { useLocation } from "react-router-dom";

// type CheckoutState = {
//   orderId: string;
//   amount: number;
//   honey: number;
// };

// export default function Checkout() {
//   // const memberId = useUserStore((s) => s.user.memberId);
//   const memberId = "100";
//   const location = useLocation();
//   const clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY;
//   const customerKey = String(memberId);
//   const state = location.state as CheckoutState;
//   const paymentWidgetRef = useRef<PaymentWidgetInstance | null>(null);
//   // useEffect 중복 렌더링 방지
//   const didInitWidget = useRef(false);
//   useEffect(() => {
//     if (didInitWidget.current) return;
//     didInitWidget.current = true;
//     (async () => {
//       const paymentWidget = await loadPaymentWidget(clientKey, customerKey);

//       paymentWidget.renderPaymentMethods("#payment-widget", {
//         value: state.amount,
//       });
//       paymentWidgetRef.current = paymentWidget;
//     })();
//   }, [clientKey, customerKey, state.amount]);

//   const handleRequestPayment = async () => {
//     const paymentWidget = paymentWidgetRef.current;

//     const origin = window.location.origin;

//     try {
//       await paymentWidget.requestPayment({
//         orderId: state.orderId,
//         orderName: `꿀 충전 ${state.honey}꿀`,
//         successUrl: `${origin}/payments/success`,
//         failUrl: `${origin}/payments/fail`,
//       });
//     } catch (e) {
//       console.log(e);
//       alert("결제 요청에 실패했어요.");
//     }
//   };

//   return (
//     <div className="App">
//       <h1>꿀 결제하기</h1>

//       <p>
//         {state.honey.toLocaleString()}꿀 / {state.amount.toLocaleString()}원
//       </p>
//       <div id="payment-widget" />
//       <button onClick={handleRequestPayment}>결제하기</button>
//     </div>
//   );
// }

import { useEffect, useMemo, useRef, useState } from "react";
// import { loadTossPayments } from "@tosspayments/payment-widget-sdk";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import { preparePayment } from "../../../api/paymentApi";
import "../style/payStyle.css";
type CheckoutState = {
  amount: number;
  honey: number; // 원화 (honey * 100 으로 계산한 값)
};

const clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY;

export function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;
  const memberId = "100";
  const customerKey = String(memberId);

  const origin = useMemo(() => window.location.origin, []);
  const paymentMethodWidgetRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  const [prepared, setPrepared] = useState<{
    orderId: string;
    amount: number;
  } | null>(null);

  // state 방어
  useEffect(() => {
    if (!state || !Number.isFinite(state.amount) || state.amount <= 0) {
      navigate(-1);
    }
  }, [navigate, state]);

  useEffect(() => {
    let canceled = false;

    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);
      const w = tossPayments.widgets({ customerKey });
      if (!canceled) setWidgets(w);
    }

    fetchPaymentWidgets();
    return () => {
      canceled = true;
    };
  }, [customerKey]);

  // 2) prepare 호출 (페이지 진입 시 1회)
  useEffect(() => {
    if (!state) return;

    let canceled = false;

    (async () => {
      try {
        const data = await preparePayment(state.amount);
        if (!canceled) setPrepared(data); // { orderId, amount }
      } catch (e) {
        console.error(e);
        alert("결제 준비에 실패했어요. 다시 시도해주세요.");
        navigate(-1);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [navigate, state]);

  // 3) 위젯 렌더 + amount 세팅 (widgets + prepared 준비되면)
  useEffect(() => {
    if (!widgets || !prepared) return;

    let canceled = false;

    (async () => {
      try {
        setReady(false);

        await widgets.setAmount({
          currency: "KRW",
          value: prepared.amount,
        });

        const [paymentMethodWidget] = await Promise.all([
          widgets.renderPaymentMethods({
            selector: "#payment-method",
            variantKey: "DEFAULT",
          }),
          widgets.renderAgreement({
            selector: "#agreement",
            variantKey: "AGREEMENT",
          }),
        ]);

        if (canceled) return;

        paymentMethodWidget.on(
          "paymentMethodSelect",
          (selectedPaymentMethod: any) => {
            console.log("selectedPaymentMethod:", selectedPaymentMethod);
          }
        );

        paymentMethodWidgetRef.current = paymentMethodWidget;
        setReady(true);
      } catch (e) {
        console.error(e);
        alert("결제 위젯 렌더링에 실패했어요.");
      }
    })();

    return () => {
      canceled = true;
    };
  }, [prepared, widgets]);

  const handlePay = async () => {
    if (!widgets || !prepared || !state) return;

    try {
      const selectedPaymentMethod =
        await paymentMethodWidgetRef.current?.getSelectedPaymentMethod?.();
      console.log("selectedPaymentMethod:", selectedPaymentMethod);

      await widgets.requestPayment({
        orderId: prepared.orderId,
        orderName: `꿀 충전 ${state.honey}꿀`,
        successUrl: `${origin}/payments/success`,
        failUrl: `${origin}/payments/fail`,
      });
    } catch (e) {
      console.error(e);
      alert("결제 요청에 실패했어요.");
    }
  };

  if (!state) return null;

  return (
    <div className="wrapper w-100">
      <div className="max-w-540 w-100">
        <div style={{ marginBottom: 12 }}>
          <div>
            {state.honey.toLocaleString()}꿀 / {state.amount.toLocaleString()}원
          </div>
          {prepared && (
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              주문번호: {prepared.orderId}
            </div>
          )}
        </div>

        <div id="payment-method" className="w-100" />
        <div id="agreement" className="w-100" />

        <div className="btn-wrapper w-100">
          <button
            className="btn primary w-100"
            disabled={!ready}
            onClick={handlePay}
          >
            {ready ? "결제하기" : "결제 준비 중..."}
          </button>
        </div>
      </div>
    </div>
  );
}
