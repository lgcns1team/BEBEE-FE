import { useEffect, useMemo, useRef, useState } from "react";
// import { loadTossPayments } from "@tosspayments/payment-widget-sdk";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import { preparePayment } from "../../../api/paymentApi";
import "../style/payStyle.css";
type CheckoutState = {
  amount: number; // 실제 결제할 원화 금액
  honey: number; // 충전할 꿀의 양
  redirectTo?: string;
};

const clientKey = import.meta.env.VITE_TOSS_PAYMENTS_CLIENT_KEY;

export function CheckoutPage() {
  // useLocation: 이전페이지에서 navigate("/checkout", { state }) 로 넘긴 state 읽기
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as CheckoutState;
  const memberId = "100";
  const customerKey = String(memberId);

  const origin = useMemo(() => window.location.origin, []);
  const paymentMethodWidgetRef = useRef(null);
  // 결제하기 버튼을 눌러도 괜찮은 상태인지 체크!
  const [ready, setReady] = useState(false);

  // 토스 결제 위젯 SDK에서 만든 widgets 객체를 저장
  const [widgets, setWidgets] = useState(null);

  // 백엔드 prepared 성공 결과를 저장
  const [prepared, setPrepared] = useState<{
    orderId: string;
    amount: number;
  } | null>(null);

  // state 방어
  // 페이지 들어오면 state가 정상인지 확인
  // state가 없거나 , amount가 숫자가 아니거나, amout가 0 이하이면 이전페이지로 돌아가기
  useEffect(() => {
    if (!state || !Number.isFinite(state.amount) || state.amount <= 0) {
      navigate(-1);
    }
  }, [navigate, state]);

  useEffect(() => {
    let canceled = false;
    // 토스 SDK 초기화
    // clientKey로 초기화 해서 tossPayments 객체를 얻음
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
        // 결제 수단 UI를 #payment-method에 렌더
        // 약관 UI를 렌더
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
  // 결제 요청 버튼 핸들러
  const handlePay = async () => {
    if (!widgets || !prepared || !state) return;

    try {
      const redirectParam = state.redirectTo
        ? `?redirect=${encodeURIComponent(state.redirectTo)}`
        : "";
      const selectedPaymentMethod =
        await paymentMethodWidgetRef.current?.getSelectedPaymentMethod?.();
      console.log("selectedPaymentMethod:", selectedPaymentMethod);
      // 실제 결제창 흐름
      // 성공하면 successUrl로 리다이렉트 되면서 paymentKey, orderId, amount 같은 쿼리가 붙음
      // 실패하면 failUrl로 이동
      await widgets.requestPayment({
        orderId: prepared.orderId,
        orderName: `꿀 충전 ${state.honey}꿀`,
        successUrl: `${origin}/payments/success${redirectParam}`,
        failUrl: `${origin}/payments/fail${redirectParam}`,
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
