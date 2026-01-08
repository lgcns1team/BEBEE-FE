import { instance } from "./axiosInstance";

export interface PreparePaymentRequest {
  amount: number; // 실제 원화 금액
}

export interface PreparePaymentResponse {
  orderId: string;
  amount: number;
}

export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

export const preparePayment = async (amount: number) => {
  const response = await instance.post<PreparePaymentResponse>(
    "/payment/payments/prepare",
    { amount } satisfies PreparePaymentRequest
  );

  return response.data;
};

export const confirmPayment = async (body: ConfirmPaymentRequest) => {
  const res = await instance.post("/payment/payments/confirm", body);
  return res.data;
};
