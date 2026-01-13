import { create } from "zustand";
import type { MessagePayload } from "firebase/messaging";

interface FCMMessage {
  title: string;
  body: string;
  data?: Record<string, any>;
  messageId?: string;
}

interface FCMMessageStore {
  message: FCMMessage | null;
  isOpen: boolean;
  showMessage: (payload: MessagePayload) => void;
  closeMessage: () => void;
}

export const useFCMMessageStore = create<FCMMessageStore>((set) => ({
  message: null,
  isOpen: false,
  showMessage: (payload) => {
    const title =
      payload.notification?.title || payload.data?.title || "새 메시지";
    const body = payload.notification?.body || payload.data?.body || "";

    set({
      message: {
        title,
        body,
        data: payload.data,
        messageId: payload.messageId,
      },
      isOpen: true,
    });
  },
  closeMessage: () => {
    set({ isOpen: false, message: null });
  },
}));
