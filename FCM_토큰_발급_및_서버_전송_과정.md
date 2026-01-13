# FCM 토큰 발급 및 서버 전송 과정 상세 가이드

## 목차

1. [전체 흐름 개요](#전체-흐름-개요)
2. [파일별 역할 및 책임](#파일별-역할-및-책임)
3. [단계별 상세 로직](#단계별-상세-로직)
4. [중요한 코드 문법 및 패턴](#중요한-코드-문법-및-패턴)
5. [데이터 흐름도](#데이터-흐름도)

---

## 전체 흐름 개요

```
사용자 로그인
    ↓
/home 페이지 접속
    ↓
HomePage.tsx 마운트
    ↓
useEffect 실행 → setupFCM() 호출
    ↓
initializeFCM() 실행
    ├─ 브라우저 지원 확인
    ├─ Service Worker 등록
    ├─ 알림 권한 요청
    └─ FCM 토큰 획득 (getToken)
    ↓
토큰 획득 성공
    ↓
registerFCMToken() 호출
    ↓
POST /notification/notifications/fcm/token
    ↓
서버에 토큰 저장 완료
```

---

## 파일별 역할 및 책임

### 1. `HomePage.tsx` - 진입점 및 오케스트레이션

**위치**: `src/domain/post/pages/HomePage.tsx`

**역할**:

- FCM 초기화의 진입점
- 사용자 로그인 상태 및 페이지 경로 확인
- FCM 초기화 및 토큰 등록을 오케스트레이션

**주요 코드**:

```typescript
// 114-156줄
useEffect(() => {
  // 로그인하지 않았거나 이미 초기화했으면 스킵
  if (!user || fcmInitialized.current) {
    return;
  }

  // 홈 페이지에서만 실행
  if (location.pathname !== "/home") {
    return;
  }

  const setupFCM = async () => {
    // FCM 초기화 및 토큰 획득
    const token = await initializeFCM();

    if (token) {
      // 서버에 토큰 등록
      await registerFCMToken(token, "WEB_PC");
      fcmInitialized.current = true;
    }
  };

  setupFCM();
}, [user, location.pathname]);
```

**중요 포인트**:

- `useRef`를 사용한 중복 초기화 방지 (`fcmInitialized.current`)
- `useEffect`의 의존성 배열: `[user, location.pathname]`
- 비동기 함수 `setupFCM`을 내부에서 정의하고 즉시 호출

---

### 2. `useFirebaseHandler.ts` - FCM 핵심 로직

**위치**: `src/hooks/useFirebaseHandler.ts`

**역할**:

- Firebase 초기화
- Service Worker 등록 및 관리
- FCM 토큰 획득
- 포그라운드 메시지 리스너 설정

**주요 함수**:

#### `initializeFCM()` - FCM 초기화 및 토큰 획득

**전체 흐름**:

```typescript
export const initializeFCM = async (): Promise<string | null> => {
  // 1. 브라우저 지원 확인
  // 2. Service Worker 메시지 리스너 설정
  // 3. 기존 Service Worker 정리
  // 4. Service Worker 등록
  // 5. Messaging 인스턴스 생성
  // 6. 알림 권한 요청
  // 7. VAPID 키 검증
  // 8. FCM 토큰 획득
  // 9. 토큰 반환
};
```

**단계별 상세**:

##### 1단계: 브라우저 지원 확인

```typescript
// 78-88줄
if (typeof window === "undefined" || !("Notification" in window)) {
  log.warn("This browser does not support notifications.");
  return null;
}

if (!("serviceWorker" in navigator)) {
  log.warn("This browser does not support service workers.");
  return null;
}
```

**중요 문법**:

- `typeof window === "undefined"`: SSR 환경 체크
- `"Notification" in window`: Notification API 지원 확인
- `"serviceWorker" in navigator`: Service Worker 지원 확인

##### 2단계: Service Worker 메시지 리스너 설정

```typescript
// 90-91줄
setupServiceWorkerMessageListener();
```

**역할**: Service Worker로부터 백그라운드 메시지를 받기 위한 리스너 등록

##### 3단계: 기존 Service Worker 정리

```typescript
// 93-110줄
const existingRegistrations = await navigator.serviceWorker.getRegistrations();
for (const registration of existingRegistrations) {
  // 기존 push subscription이 있으면 unsubscribe
  const subscription = await registration.pushManager?.getSubscription();
  if (subscription) {
    await subscription.unsubscribe();
  }
  // 기존 Service Worker 제거
  await registration.unregister();
}
```

**중요 문법**:

- `navigator.serviceWorker.getRegistrations()`: 등록된 모든 Service Worker 가져오기
- `registration.pushManager?.getSubscription()`: Optional chaining (`?.`)
- `subscription.unsubscribe()`: 기존 Push Subscription 제거
- `registration.unregister()`: Service Worker 등록 해제

**이유**: 손상된 Push Subscription이나 오래된 Service Worker를 정리하여 새로운 토큰을 깨끗하게 획득

##### 4단계: Service Worker 등록

```typescript
// 112-158줄
registration = await navigator.serviceWorker.register(
  "/firebase-messaging-sw.js",
  { scope: "/" }
);
```

**Service Worker 활성화 대기**:

```typescript
// 123-142줄
if (registration.installing) {
  await new Promise<void>((resolve) => {
    registration.installing!.addEventListener("statechange", () => {
      if (registration.installing?.state === "activated") {
        resolve();
      }
    });
  });
} else if (registration.waiting) {
  registration.waiting.postMessage({ type: "SKIP_WAITING" });
  await new Promise<void>((resolve) => {
    registration.waiting!.addEventListener("statechange", () => {
      if (registration.waiting?.state === "activated") {
        resolve();
      }
    });
  });
}
```

**중요 문법**:

- `navigator.serviceWorker.register(path, options)`: Service Worker 등록
- `registration.installing`: 설치 중인 Service Worker
- `registration.waiting`: 대기 중인 Service Worker
- `registration.active`: 활성화된 Service Worker
- `new Promise<void>((resolve) => {...})`: 비동기 대기 패턴
- `!` (Non-null assertion): TypeScript에서 null이 아님을 보장

**Firebase 설정 전달**:

```typescript
// 144-151줄
if (registration.active) {
  registration.active.postMessage({
    type: "FIREBASE_CONFIG",
    config: firebaseConfig,
  });
}
```

**중요 문법**:

- `postMessage()`: Service Worker와 메인 스레드 간 통신

##### 5단계: Messaging 인스턴스 생성

```typescript
// 160-163줄
if (!messaging) {
  messaging = getMessaging(app);
}
```

**역할**: Firebase Messaging 인스턴스 생성 (싱글톤 패턴)

##### 6단계: 알림 권한 요청

```typescript
// 165-170줄
const permission = await Notification.requestPermission();
if (permission !== "granted") {
  log.warn("Notification permission denied.");
  return null;
}
```

**중요 문법**:

- `Notification.requestPermission()`: 알림 권한 요청 (Promise 반환)
- 반환값: `"granted"` | `"denied"` | `"default"`

##### 7단계: VAPID 키 검증

```typescript
// 172-186줄
if (!vapidKey) {
  log.warn("VAPID 키가 설정되지 않았습니다.");
  return null;
}

// VAPID 키 형식 검증 (base64 URL-safe 형식)
if (!/^[A-Za-z0-9_-]+$/.test(vapidKey)) {
  log.error("VAPID 키 형식이 올바르지 않습니다.");
  return null;
}
```

**중요 문법**:

- 정규식: `/^[A-Za-z0-9_-]+$/` - base64 URL-safe 형식 검증
- `.test()`: 정규식 매칭 테스트

##### 8단계: FCM 토큰 획득

```typescript
// 188-197줄
const token = await getToken(messaging, { vapidKey });
if (token) {
  log.info("[FCM] Registration Token:", token);
  return token;
} else {
  log.warn("[FCM] No registration token available.");
  return null;
}
```

**중요 문법**:

- `getToken(messaging, { vapidKey })`: FCM 토큰 획득
- 반환값: `Promise<string | null>`

---

### 3. `notificationApi.ts` - 서버 통신

**위치**: `src/api/notificationApi.ts`

**역할**:

- FCM 토큰을 서버에 등록하는 API 호출

**주요 코드**:

```typescript
export const registerFCMToken = async (
  token: string,
  deviceType: RegisterFCMTokenRequest["deviceType"] = "WEB_PC"
): Promise<RegisterFCMTokenResponse> => {
  const response = await instance.post<RegisterFCMTokenResponse>(
    "/notification/notifications/fcm/token",
    {
      token,
      deviceType,
    }
  );
  return response.data;
};
```

**중요 문법**:

- `instance.post<T>(url, data)`: Axios 인스턴스를 통한 POST 요청
- 제네릭 타입 `<RegisterFCMTokenResponse>`: 응답 타입 지정
- 기본 매개변수: `deviceType = "WEB_PC"`

**요청 형식**:

```typescript
POST /notification/notifications/fcm/token
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "token": "cDrOyXSUVXqTcRVfZ8yFLo:APA91bE...",
  "deviceType": "WEB_PC"
}
```

**응답 형식**:

```typescript
{
  "success": boolean;
  "message"?: string;
}
```

---

### 4. `firebase-messaging-sw.js` - Service Worker

**위치**: `public/firebase-messaging-sw.js`

**역할**:

- 백그라운드 메시지 수신 처리
- 알림 표시
- 알림 클릭 이벤트 처리

**주요 로직**:

#### Firebase 초기화

```javascript
// 15-28줄
const initializeFirebase = (config) => {
  if (!firebaseApp) {
    try {
      firebaseApp = firebase.initializeApp(config);
      messaging = firebase.messaging();
      setupMessageHandlers();
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }
};
```

**중요 문법**:

- `firebase.initializeApp(config)`: Firebase 초기화
- `firebase.messaging()`: Messaging 인스턴스 생성

#### 메인 스레드로부터 설정 수신

```javascript
// 31-39줄
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "FIREBASE_CONFIG") {
    const firebaseConfig = event.data.config;
    initializeFirebase(firebaseConfig);
  } else if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
```

**중요 문법**:

- `self.addEventListener("message", ...)`: Service Worker 메시지 리스너
- `self.skipWaiting()`: Service Worker 즉시 활성화

#### 백그라운드 메시지 처리

```javascript
// 69-99줄
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "새 메시지";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/icon.png",
    badge: "/icon.png",
    tag: payload.messageId,
    requireInteraction: false,
    data: {
      ...payload.data,
      fcmPayload: JSON.stringify(payload),
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);

  // 메인 스레드로 메시지 전달
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "FCM_BACKGROUND_MESSAGE",
        payload: payload,
      });
    });
  });
});
```

**중요 문법**:

- `messaging.onBackgroundMessage()`: 백그라운드 메시지 리스너
- `self.registration.showNotification()`: 알림 표시
- `self.clients.matchAll()`: 모든 클라이언트 가져오기
- `client.postMessage()`: 메인 스레드로 메시지 전달
- `JSON.stringify()` / `JSON.parse()`: 객체 직렬화/역직렬화

---

## 단계별 상세 로직

### Phase 1: 초기화 준비

```
HomePage.tsx 마운트
    ↓
useEffect 실행
    ↓
조건 확인:
  - user 존재 여부
  - fcmInitialized.current (중복 방지)
  - location.pathname === "/home"
    ↓
setupFCM() 호출
```

### Phase 2: FCM 초기화

```
initializeFCM() 호출
    ↓
1. 브라우저 지원 확인
   - Notification API
   - Service Worker API
    ↓
2. Service Worker 메시지 리스너 설정
   - setupServiceWorkerMessageListener()
    ↓
3. 기존 Service Worker 정리
   - getRegistrations()
   - unsubscribe()
   - unregister()
    ↓
4. Service Worker 등록
   - register("/firebase-messaging-sw.js")
   - 활성화 대기 (installing/waiting 상태 처리)
   - Firebase 설정 전달 (postMessage)
    ↓
5. Messaging 인스턴스 생성
   - getMessaging(app)
    ↓
6. 알림 권한 요청
   - Notification.requestPermission()
    ↓
7. VAPID 키 검증
   - 형식 검증 (정규식)
    ↓
8. FCM 토큰 획득
   - getToken(messaging, { vapidKey })
    ↓
토큰 반환 (string | null)
```

### Phase 3: 서버 등록

```
토큰 획득 성공
    ↓
registerFCMToken(token, "WEB_PC") 호출
    ↓
POST /notification/notifications/fcm/token
    Body: { token, deviceType: "WEB_PC" }
    ↓
서버 응답 수신
    ↓
fcmInitialized.current = true
```

---

## 중요한 코드 문법 및 패턴

### 1. 비동기 처리 패턴

#### async/await

```typescript
const setupFCM = async () => {
  const token = await initializeFCM();
  if (token) {
    await registerFCMToken(token, "WEB_PC");
  }
};
```

#### Promise 체이닝

```typescript
self.clients.matchAll().then((clients) => {
  clients.forEach((client) => {
    client.postMessage({ ... });
  });
});
```

### 2. Optional Chaining (`?.`)

```typescript
// 안전한 속성 접근
const subscription = await registration.pushManager?.getSubscription();
if (subscription) {
  await subscription.unsubscribe();
}

// Optional chaining with nullish coalescing
const title = payload.notification?.title || "새 메시지";
```

### 3. Non-null Assertion (`!`)

```typescript
// TypeScript에서 null이 아님을 보장
registration.installing!.addEventListener("statechange", () => {
  // ...
});
```

### 4. 싱글톤 패턴

```typescript
// Firebase App 초기화 (중복 방지)
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Messaging 인스턴스 (싱글톤)
if (!messaging) {
  messaging = getMessaging(app);
}
```

### 5. useRef를 사용한 중복 방지

```typescript
const fcmInitialized = useRef(false);

useEffect(() => {
  if (fcmInitialized.current) {
    return; // 이미 초기화됨
  }
  // 초기화 로직
  fcmInitialized.current = true;
}, []);
```

### 6. 정규식 검증

```typescript
// VAPID 키 형식 검증 (base64 URL-safe)
if (!/^[A-Za-z0-9_-]+$/.test(vapidKey)) {
  return null;
}
```

### 7. 환경 변수 접근

```typescript
// Vite 환경 변수
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isDev = import.meta.env.DEV;
```

### 8. Service Worker 통신

```typescript
// 메인 스레드 → Service Worker
registration.active.postMessage({
  type: "FIREBASE_CONFIG",
  config: firebaseConfig,
});

// Service Worker → 메인 스레드
self.clients.matchAll().then((clients) => {
  clients.forEach((client) => {
    client.postMessage({
      type: "FCM_BACKGROUND_MESSAGE",
      payload: payload,
    });
  });
});
```

### 9. 타입 안전성

```typescript
// 인터페이스 정의
export interface RegisterFCMTokenRequest {
  token: string;
  deviceType: "WEB_PC" | "WEB_MOBILE" | "IOS" | "ANDROID";
}

// 제네릭 타입 사용
const response = await instance.post<RegisterFCMTokenResponse>(url, data);
```

### 10. 에러 처리

```typescript
try {
  const token = await initializeFCM();
  if (token) {
    await registerFCMToken(token, "WEB_PC");
  }
} catch (error) {
  if (isDev) {
    console.error("❌ [FCM] 초기화 오류:", error);
  }
}
```

---

## 데이터 흐름도

### 토큰 획득 흐름

```
[HomePage.tsx]
    ↓ setupFCM()
    ↓
[useFirebaseHandler.ts]
    ↓ initializeFCM()
    ├─ 브라우저 지원 확인
    ├─ Service Worker 등록
    │   └─ [firebase-messaging-sw.js] 초기화
    ├─ 알림 권한 요청
    ├─ VAPID 키 검증
    └─ getToken(messaging, { vapidKey })
        ↓
    토큰 반환 (string)
    ↓
[HomePage.tsx]
    ↓ registerFCMToken(token, "WEB_PC")
    ↓
[notificationApi.ts]
    ↓ POST /notification/notifications/fcm/token
    ↓
[서버]
    토큰 저장 완료
```

### 메시지 수신 흐름

```
[FCM 서버]
    ↓ 푸시 메시지 전송
    ↓
[Service Worker] (firebase-messaging-sw.js)
    ├─ onBackgroundMessage() 실행
    ├─ 알림 표시
    └─ 메인 스레드로 메시지 전달
        ↓
[메인 스레드] (useFirebaseHandler.ts)
    ├─ setupServiceWorkerMessageListener()
    └─ useFCMMessageStore.showMessage()
        ↓
[UI] 모달 팝업 표시
```

---

## 핵심 체크리스트

### 토큰 발급 전제 조건

1. ✅ 브라우저가 Notification API 지원
2. ✅ 브라우저가 Service Worker 지원
3. ✅ Service Worker 등록 성공
4. ✅ 알림 권한 허용 (`"granted"`)
5. ✅ VAPID 키 설정 및 형식 검증 통과
6. ✅ Firebase 설정 완료

### 서버 등록 전제 조건

1. ✅ FCM 토큰 획득 성공
2. ✅ 사용자 로그인 상태 (`user` 존재)
3. ✅ 네트워크 연결
4. ✅ 서버 API 엔드포인트 접근 가능

---

## 트러블슈팅 포인트

### 1. Service Worker 등록 실패

- **원인**: 파일 경로 오류, HTTPS 미사용 (localhost 제외)
- **해결**: `public/firebase-messaging-sw.js` 파일 존재 확인

### 2. 토큰 획득 실패

- **원인**: VAPID 키 누락/오류, 알림 권한 거부
- **해결**: VAPID 키 확인, 브라우저 설정에서 권한 허용

### 3. 서버 등록 실패

- **원인**: 네트워크 오류, 인증 토큰 만료
- **해결**: 네트워크 확인, 토큰 재발급

---

## 모바일 환경 지원

### 모바일 기기 감지

현재 코드는 User Agent를 기반으로 모바일 기기를 자동 감지합니다:

```typescript
// HomePage.tsx
const detectDeviceType = (): "WEB_PC" | "WEB_MOBILE" => {
  if (typeof window === "undefined") return "WEB_PC";

  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;
  const isMobile =
    /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent.toLowerCase()
    );

  return isMobile ? "WEB_MOBILE" : "WEB_PC";
};
```

### 모바일 브라우저 지원 현황

#### ✅ 완전 지원 (Android)

- **Chrome (Android)**: Service Worker, Notification API 완전 지원
- **Samsung Internet**: 완전 지원
- **Firefox (Android)**: 완전 지원

#### ⚠️ 제한적 지원 (iOS)

- **Safari (iOS 16.4+)**: Service Worker 및 Notification API 지원
  - 백그라운드 알림은 지원되지만, 일부 제한사항 존재
  - 사용자가 사이트를 홈 화면에 추가한 경우 더 나은 지원
- **Chrome (iOS)**: Safari WebView 기반이므로 Safari와 동일한 제한사항

#### ❌ 미지원

- **Safari (iOS 16.3 이하)**: Service Worker 및 Notification API 미지원

### 모바일 환경에서의 주의사항

1. **알림 권한 요청 타이밍**

   - 모바일에서는 사용자 상호작용(터치 이벤트) 후에만 권한 요청 가능
   - 현재는 `/home` 페이지 접속 시 자동 요청 (일부 브라우저에서 차단될 수 있음)

2. **백그라운드 알림**

   - Android: 완전 지원
   - iOS: Safari에서 백그라운드 알림 지원 (iOS 16.4+)
   - iOS에서 더 나은 경험을 위해 PWA로 설치 권장

3. **Service Worker 범위**

   - 모바일에서도 동일하게 `/` 범위로 등록
   - HTTPS 필수 (localhost 제외)

4. **배터리 최적화**
   - Android의 배터리 최적화 설정이 Service Worker를 제한할 수 있음
   - 사용자에게 배터리 최적화 예외 설정 안내 필요할 수 있음

### 모바일 테스트 체크리스트

- [ ] Android Chrome에서 알림 권한 요청 및 토큰 획득
- [ ] iOS Safari (16.4+)에서 알림 권한 요청 및 토큰 획득
- [ ] 백그라운드 알림 수신 테스트
- [ ] 알림 클릭 시 앱 열기 테스트
- [ ] PWA 설치 후 알림 동작 확인 (iOS)

---

## 참고 자료

- [Firebase Cloud Messaging 문서](https://firebase.google.com/docs/cloud-messaging)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web Push Notifications](https://web.dev/push-notifications-overview/)
- [iOS Safari Service Worker 지원](https://webkit.org/blog/13936/web-push-for-web-apps-on-ios-and-ipados/)
