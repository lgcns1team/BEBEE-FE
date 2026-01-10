import { instance } from ".//axiosInstance";
import type {
  AgreementRequest,
  AgreementResponse,
  AgreementConfirmRequest,
  AgreementConfirmResponse,
  AgreementRefuseRequest,
} from "../domain/chat/types/match.types";

export const createAgreement = async (
  data: AgreementRequest
): Promise<AgreementResponse> => {
  const response = await instance.post<AgreementResponse>(
    "match/agreements",
    data
  );
  return response.data;
};

// 매칭 확인서 수락
export const confirmAgreement = async (
  agreementId: string,
  data: AgreementConfirmRequest
): Promise<AgreementConfirmResponse> => {
  const response = await instance.post<AgreementConfirmResponse>(
    `match/agreements/${agreementId}/confirm`,
    data
  );
  return response.data;
};

// 매칭 확인서 거절
export const refuseAgreement = async (
  agreementId: string,
  data: AgreementRefuseRequest
): Promise<void> => {
  await instance.patch<void>(`match/agreements/${agreementId}/refuse`, data);
};
