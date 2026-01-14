// Firebase Service Worker for FCM background messages
// This file must be in the public directory

importScripts(
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.7.0/firebase-messaging-compat.js"
);

let firebaseApp = null;
let messaging = null;

// Fallback: 직접 설정이 필요한 경우 (메시지로 설정이 전달되지 않은 경우)
// Service Worker에서는 import.meta.env를 사용할 수 없으므로 하드코딩된 설정 사용
const fallbackConfig = {
  apiKey: "AIzaSyAdvajxr9nwDEBFfuajsbDhuHuWdu0v4uk",
  authDomain: "bebee-c4d61.firebaseapp.com",
  projectId: "bebee-c4d61",
  storageBucket: "bebee-c4d61.firebasestorage.app",
  messagingSenderId: "1024519360208",
  appId: "1:1024519360208:web:46d14c7ace75447756d8d5",
  measurementId: "G-S2H4Q7TRCG",
};

// Firebase 초기화 및 Messaging 설정 함수
const initializeFirebase = (config) => {
  if (!firebaseApp) {
    try {
      // Firebase App 초기화
      firebaseApp = firebase.initializeApp(config);
      // App 초기화 후에만 Messaging 인스턴스 생성
      messaging = firebase.messaging();
      setupMessageHandlers();
    } catch (error) {
      console.error(
        "[firebase-messaging-sw.js] Firebase initialization error:",
        error
      );
    }
  } else {
    // 이미 초기화된 경우에도 messaging이 없으면 생성
    if (!messaging) {
      messaging = firebase.messaging();
      setupMessageHandlers();
    }
  }
};

// 메인 스레드로부터 메시지 수신
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    const firebaseConfig = event.data.config;
    initializeFirebase(firebaseConfig);
  } else if (event.data && event.data.type === "SKIP_WAITING") {
    // Service Worker 업데이트 시 즉시 활성화
    self.skipWaiting();
  }
});

// 알림 클릭 핸들러 (최상위 레벨에서 등록 - 초기 평가 시점)
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // 알림 데이터에서 FCM 페이로드 복원
  const notificationData = event.notification.data;
  let fcmPayload = null;

  if (notificationData?.fcmPayload) {
    try {
      fcmPayload = JSON.parse(notificationData.fcmPayload);
    } catch (e) {
      console.error("Failed to parse FCM payload:", e);
    }
  }

  // 클라이언트 열기 또는 포커스
  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // 이미 열려있는 창이 있으면 포커스하고 메시지 전달
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes("/") && "focus" in client) {
            // FCM 페이로드를 메인 스레드로 전달하여 모달 표시
            if (fcmPayload) {
              client.postMessage({
                type: "FCM_NOTIFICATION_CLICK",
                payload: fcmPayload,
              });
            }
            return client.focus();
          }
        }
        // 새 창 열기
        if (clients.openWindow) {
          const urlToOpen = "/";
          return clients.openWindow(urlToOpen).then((windowClient) => {
            if (windowClient && fcmPayload) {
              // 새 창이 열린 후 메시지 전달
              setTimeout(() => {
                windowClient.postMessage({
                  type: "FCM_NOTIFICATION_CLICK",
                  payload: fcmPayload,
                });
              }, 1000);
            }
          });
        }
      })
  );
});

// Fallback 초기화 (최상위 레벨에서 실행)
if (fallbackConfig.apiKey) {
  // 즉시 초기화 (setTimeout 제거)
  initializeFirebase(fallbackConfig);
}

// 메시지 핸들러 설정 함수
function setupMessageHandlers() {
  if (!messaging) return;

  // 백그라운드 메시지 수신 핸들러
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification?.title || "새 메시지";
    const notificationOptions = {
      body: payload.notification?.body || "",
      icon: "/icon.png",
      badge: "/icon.png",
      tag: payload.messageId,
      requireInteraction: false,
      data: {
        ...payload.data,
        fcmPayload: JSON.stringify(payload), // 메인 스레드로 전달하기 위해 저장
      },
    };

    const notificationPromise = self.registration.showNotification(
      notificationTitle,
      notificationOptions
    );

    // 메인 스레드로 메시지 전달 (페이지가 열려있는 경우 모달 표시를 위해)
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "FCM_BACKGROUND_MESSAGE",
          payload: payload,
        });
      });
    });

    return notificationPromise;
  });
}
