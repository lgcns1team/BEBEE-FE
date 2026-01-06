import { instance } from "../../../api/axiosInstance";
import type { AgreementRequest, AgreementResponse } from "../agreement.types";

export const createAgreement = async (
  data: AgreementRequest
): Promise<AgreementResponse> => {
  const response = await instance.post<AgreementResponse>(
    "match/agreements",
    data
  );
  return response.data;
};
