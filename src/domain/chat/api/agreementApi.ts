import { instance } from "../../../api/axiosInstance";
import type {
  AgreementRequest,
  AgreementResponse,
  AgreementMetadata,
} from "../agreement.types";

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
  data: AgreementMetadata
): Promise<void> => {
  await instance.patch(`match/agreements/${agreementId}/confirm`, data);
};
