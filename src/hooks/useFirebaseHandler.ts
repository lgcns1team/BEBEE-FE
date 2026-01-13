import { initializeApp, getApps } from "firebase/app";
import type { FirebaseApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import type { Messaging, MessagePayload } from "firebase/messaging";
import { useFCMMessageStore } from "../store/useFCMStore";

// 개발 환경 여부 확인
const isDev = import.meta.env.DEV;

// 콘솔 로그 헬퍼 (개발 환경에서만 출력)
const log = {
  info: (...args: unknown[]) => {
    if (isDev) console.log(...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn(...args);
  },
  error: (...args: unknown[]) => {
    if (isDev) console.error(...args);
  },
};

// Firebase 설정
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Firebase App 초기화 (중복 초기화 방지)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// FCM Messaging 인스턴스
let messaging: Messaging | null = null;

// VAPID 키 (FCM 웹 푸시에 필요)
// 환경 변수에서 가져오거나, 없으면 fallback 사용
const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;

/**
 * Service Worker로부터 메시지 수신 리스너 설정
 */
const setupServiceWorkerMessageListener = () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data && event.data.type === "FCM_BACKGROUND_MESSAGE") {
      log.info(
        "🔔 [FCM] Service Worker로부터 백그라운드 메시지 수신:",
        event.data.payload
      );
      const { showMessage } = useFCMMessageStore.getState();
      showMessage(event.data.payload);
    } else if (event.data && event.data.type === "FCM_NOTIFICATION_CLICK") {
      log.info("🔔 [FCM] 알림 클릭으로 인한 메시지 수신:", event.data.payload);
      const { showMessage } = useFCMMessageStore.getState();
      showMessage(event.data.payload);
    }
  });
};

/**
 * FCM 초기화 및 토큰 가져오기
 * @param requestPermission - 알림 권한 요청 여부 (기본값: true)
 */
export const initializeFCM = async (requestPermission: boolean = true): Promise<string | null> => {
  try {
    // HTTPS 확인 (배포 환경에서 중요)
    if (typeof window !== "undefined") {
      const isSecureContext = window.isSecureContext || location.protocol === "https:" || location.hostname === "localhost";
      if (!isSecureContext) {
        const errorMsg = "FCM은 HTTPS 또는 localhost에서만 작동합니다.";
        log.error(errorMsg);
        // 배포 환경에서도 에러 표시
        console.error("❌ [FCM]", errorMsg, { protocol: location.protocol, hostname: location.hostname });
        return null;
      }
    }

    // 브라우저 지원 확인
    if (typeof window === "undefined" || !("Notification" in window)) {
      log.warn("This browser does not support notifications.");
      return null;
    }

    // Service Worker 지원 확인
    if (!("serviceWorker" in navigator)) {
      log.warn("This browser does not support service workers.");
      return null;
    }

    // Service Worker 메시지 리스너 설정
    setupServiceWorkerMessageListener();

    // 기존 Service Worker 등록 확인 및 정리
    try {
      const existingRegistrations =
        await navigator.serviceWorker.getRegistrations();
      for (const registration of existingRegistrations) {
        // 기존 push subscription이 있으면 unsubscribe
        const subscription = await registration.pushManager?.getSubscription();
        if (subscription) {
          await subscription.unsubscribe();
          log.info("✅ [FCM] 기존 push subscription 제거됨");
        }
        // 기존 Service Worker 제거
        await registration.unregister();
        log.info("✅ [FCM] 기존 Service Worker 제거됨");
      }
    } catch (error) {
      log.warn("⚠️ [FCM] 기존 Service Worker 정리 중 오류:", error);
    }

    // Service Worker 등록
    let registration;
    try {
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        {
          scope: "/",
        }
      );
      log.info("✅ [FCM] Service Worker registered");

      // Service Worker가 완전히 활성화될 때까지 대기
      if (registration.installing) {
        await new Promise<void>((resolve) => {
          registration.installing!.addEventListener("statechange", () => {
            if (registration.installing?.state === "activated") {
              resolve();
            }
          });
        });
      } else if (registration.waiting) {
        // waiting 상태인 경우 activate
        registration.waiting.postMessage({ type: "SKIP_WAITING" });
        await new Promise<void>((resolve) => {
          registration.waiting!.addEventListener("statechange", () => {
            if (registration.waiting?.state === "activated") {
              resolve();
            }
          });
        });
      }

      // Service Worker가 활성화되면 Firebase 설정 전달
      if (registration.active) {
        registration.active.postMessage({
          type: "FIREBASE_CONFIG",
          config: firebaseConfig,
        });
        log.info("[FCM] Firebase 설정이 Service Worker에 전달됨");
      }

      // Service Worker가 완전히 준비될 때까지 약간의 지연
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      log.error("[FCM] Service Worker registration failed:", error);
      // Service Worker 등록 실패해도 계속 진행 (이미 등록된 경우)
    }

    // Messaging 인스턴스 생성
    if (!messaging) {
      messaging = getMessaging(app);
    }

    // 알림 권한 확인 및 요청
    let permission = Notification.permission;
    
    if (permission === "default" && requestPermission) {
      // 권한이 아직 요청되지 않은 경우에만 요청
      try {
        permission = await Notification.requestPermission();
        // 배포 환경에서도 로깅
        console.log("🔔 [FCM] 알림 권한 요청 결과:", permission);
      } catch (error) {
        const errorMsg = "알림 권한 요청 중 오류가 발생했습니다.";
        log.error(errorMsg, error);
        // 배포 환경에서도 에러 표시
        console.error("❌ [FCM]", errorMsg, error);
        return null;
      }
    }

    if (permission !== "granted") {
      const reason = permission === "denied" ? "사용자가 거부했습니다." : "권한이 요청되지 않았습니다.";
      log.warn(`Notification permission denied. ${reason}`);
      // 배포 환경에서도 로깅
      console.warn("⚠️ [FCM] 알림 권한 거부:", reason);
      return null;
    }

    // FCM 토큰 가져오기
    if (!vapidKey) {
      log.warn(
        "VAPID 키가 설정되지 않았습니다. FCM 토큰을 가져올 수 없습니다."
      );
      return null;
    }

    // VAPID 키 형식 검증 (base64 URL-safe 형식이어야 함)
    if (!/^[A-Za-z0-9_-]+$/.test(vapidKey)) {
      log.error(
        "[FCM] VAPID 키 형식이 올바르지 않습니다. base64 URL-safe 형식이어야 합니다."
      );
      return null;
    }

    log.info("[FCM] VAPID 키 사용:", vapidKey.substring(0, 20) + "...");

    const token = await getToken(messaging, { vapidKey });
    if (token) {
      log.info("[FCM] Registration Token:", token);
      return token;
    } else {
      log.warn("[FCM] No registration token available.");
      return null;
    }
  } catch (error) {
    log.error("Error initializing FCM:", error);
    return null;
  }
};

/**
 * 포그라운드 메시지 수신 핸들러 설정
 */
export const onMessageListener = (): Promise<MessagePayload> => {
  return new Promise((resolve) => {
    if (!messaging) {
      messaging = getMessaging(app);
    }

    onMessage(messaging, (payload) => {
      log.info("Message received in foreground:", payload);
      resolve(payload);
    });
  });
};

/**
 * FCM 메시지 수신 준비 (포그라운드 메시지 리스너 설정)
 */
export const setupFCMMessageListener = () => {
  if (!messaging) {
    messaging = getMessaging(app);
  }

  onMessage(messaging, (payload) => {
    log.info("🔔 [FCM] 포그라운드 메시지 수신:", payload);
    log.info("📋 메시지 상세 정보:", {
      title: payload.notification?.title,
      body: payload.notification?.body,
      data: payload.data,
      messageId: payload.messageId,
      from: payload.from,
    });

    // 모달 팝업 표시
    const { showMessage } = useFCMMessageStore.getState();
    showMessage(payload);

    // 알림도 함께 표시 (선택사항)
    if (payload.notification) {
      const notificationTitle = payload.notification.title || "새 메시지";
      const notificationOptions: NotificationOptions = {
        body: payload.notification.body || "",
        icon: payload.notification.icon || "/icon.png",
        badge: "/icon.png",
        tag: payload.messageId,
        requireInteraction: false,
        data: payload.data || {},
        silent: true, // 모달이 이미 표시되므로 알림 소리 비활성화
      };

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(notificationTitle, notificationOptions);
        });
      } else {
        new Notification(notificationTitle, notificationOptions);
      }
    } else if (payload.data) {
      // notification이 없고 data만 있는 경우
      log.info("📦 [FCM] 데이터만 포함된 메시지:", payload.data);
      const notificationTitle = payload.data.title || "새 메시지";
      const notificationBody =
        payload.data.body || JSON.stringify(payload.data);

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification(notificationTitle, {
            body: notificationBody,
            icon: "/icon.png",
            badge: "/icon.png",
            data: payload.data,
            silent: true,
          });
        });
      }
    }
  });
};

export { app, messaging };
