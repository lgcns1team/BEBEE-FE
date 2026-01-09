// 새로고침 했을 때 잔액을 조회하기 위한 훅입니다.

import { getCurrentHoney } from "../../../api/walletApi";
import { useWalletStore } from "../store/useWalletStore";

export function useWalletActions() {
  const setCurrentHoney = useWalletStore((s) => s.setCurrentHoney);

  const refreshCurrentHoney = async () => {
    const data = await getCurrentHoney();
    setCurrentHoney(data.currentHoney);
    return data.currentHoney;
  };
  return { refreshCurrentHoney };
}
