import { create } from "zustand";
import { persist } from "zustand/middleware";

interface NotificationPermissionStore {
  hasShownModal: boolean; // 모달을 한 번이라도 표시했는지 여부 (localStorage에 저장)
  isModalOpen: boolean; // 현재 모달이 열려있는지 여부 (세션 상태)
  hasShownTooltip: boolean; // 말풍선을 한 번이라도 표시했는지 여부 (localStorage에 저장)
  showModal: () => void;
  hideModal: () => void;
  showTooltip: () => void; // 말풍선 표시
  reset: () => void; // 테스트용 리셋 함수
}

export const useNotificationPermissionStore = create<NotificationPermissionStore>()(
  persist(
    (set) => ({
      hasShownModal: false,
      isModalOpen: false,
      hasShownTooltip: false,
      showModal: () => set({ hasShownModal: true, isModalOpen: true }),
      hideModal: () => set({ isModalOpen: false }), // 모달 닫기 (hasShownModal은 유지)
      showTooltip: () => set({ hasShownTooltip: true }), // 말풍선 표시 (한 번만)
      reset: () => set({ hasShownModal: false, isModalOpen: false, hasShownTooltip: false }), // 개발/테스트용
    }),
    {
      name: "notification-permission-modal", // localStorage 키
      partialize: (state) => ({ 
        hasShownModal: state.hasShownModal,
        hasShownTooltip: state.hasShownTooltip 
      }), // hasShownModal과 hasShownTooltip만 저장
    }
  )
);
