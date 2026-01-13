# FCM 토큰 등록 기능 상세 가이드

## 목차

1. [개요](#개요)
2. [아키텍처 및 구조](#아키텍처-및-구조)
3. [파일 구조](#파일-구조)
4. [주요 컴포넌트 설명](#주요-컴포넌트-설명)
5. [API 엔드포인트](#api-엔드포인트)
6. [사용 흐름](#사용-흐름)
7. [설정 방법](#설정-방법)
8. [트러블슈팅](#트러블슈팅)
9. [주의사항](#주의사항)

---

## 개요

FCM(Firebase Cloud Messaging) 토큰 등록 기능은 사용자가 웹 애플리케이션에서 푸시 알림을 받을 수 있도록 하는 핵심 기능입니다.

### 주요 기능

- 사용자 로그인 후 자동으로 FCM 토큰 획득 및 서버 등록
- 브라우저 알림 권한 요청 및 처리
- 포그라운드/백그라운드 메시지 수신 처리
- Service Worker를 통한 백그라운드 알림 처리

### 기술 스택

- **Firebase SDK**: Firebase Cloud Messaging (FCM)
- **Service Worker**: 백그라운드 메시지 처리
- **React Hooks**: `useEffect`를 통한 초기화
- **Zustand**: FCM 메시지 상태 관리

---

## 아키텍처 및 구조

```
┌─────────────────────────────────────────────────────────────┐
│                        사용자 브라우저                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │   HomePage.tsx   │─────────▶│ useFirebaseHandler│         │
│  │                  │         │   .ts             │         │
│  │ - FCM 초기화     │         │ - initializeFCM() │         │
│  │ - 토큰 등록      │         │ - getToken()     │         │
│  └──────────────────┘         └──────────────────┘         │
│           │                            │                     │
│           │                            ▼                     │
│           │                  ┌──────────────────┐          │
│           │                  │ notificationApi  │          │
│           │                  │   .ts            │          │
│           │                  │ - registerFCMToken│          │
│           │                  └──────────────────┘          │
│           │                            │                     │
│           │                            ▼                     │
│           │                  ┌──────────────────┐          │
│           │                  │   Backend API    │          │
│           │                  │ POST /notification│          │
│           │                  │   /fcm/token     │          │
│           │                  └──────────────────┘          │
│           │                                                  │
│           ▼                                                  │
│  ┌──────────────────┐                                       │
│  │ Service Worker   │                                       │
│  │ firebase-        │                                       │
│  │ messaging-sw.js  │                                       │
│  │                  │                                       │
│  │ - 백그라운드     │                                       │
│  │   메시지 처리    │                                       │
│  └──────────────────┘                                       │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 파일 구조

### 1. API 레이어

```
src/api/notificationApi.ts
```

- FCM 토큰 등록 API 호출
- `registerFCMToken(token, deviceType)` 함수 제공

### 2. Firebase 핸들러

```
src/hooks/useFirebaseHandler.ts
```

- Firebase 초기화
- FCM 토큰 획득
- Service Worker 등록 및 설정
- 포그라운드 메시지 리스너 설정

### 3. Service Worker

```
public/firebase-messaging-sw.js
```

- 백그라운드 메시지 수신 처리
- 알림 클릭 이벤트 처리
- 메인 스레드와 통신

### 4. 상태 관리

```
src/store/useFCMStore.ts
```

- FCM 메시지 상태 관리
- 메시지 표시/닫기 기능

### 5. 페이지 통합

```
src/domain/post/pages/HomePage.tsx
```

- FCM 초기화 로직 통합
- 로그인 사용자에 대한 토큰 등록

---

## 주요 컴포넌트 설명

### 1. `notificationApi.ts`

#### 인터페이스

```typescript
export interface RegisterFCMTokenRequest {
  token: string;
  deviceType: "WEB_PC" | "WEB_MOBILE" | "IOS" | "ANDROID";
}

export interface RegisterFCMTokenResponse {
  success: boolean;
  message?: string;
}
```

#### 주요 함수

```typescript
registerFCMToken(token: string, deviceType: "WEB_PC" = "WEB_PC")
```

- **역할**: FCM 토큰을 서버에 등록
- **파라미터**:
  - `token`: FCM에서 발급받은 토큰
  - `deviceType`: 디바이스 타입 (기본값: "WEB_PC")
- **반환값**: `RegisterFCMTokenResponse`
- **엔드포인트**: `POST /notification/notifications/fcm/token`

---

### 2. `useFirebaseHandler.ts`

#### Firebase 설정

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy...",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "bebee-c4d61.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "bebee-c4d61",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "bebee-c4d61.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1024519360208",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:1024519360208:web:46d14c7ace75447756d8d5",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-S2H4Q7TRCG",
};
```

#### 주요 함수

##### `initializeFCM(): Promise<string | null>`

- **역할**: FCM 초기화 및 토큰 획득
- **동작 순서**:
  1. 브라우저 지원 확인 (Notification API, Service Worker)
  2. Service Worker 메시지 리스너 설정
  3. Service Worker 등록 (`/firebase-messaging-sw.js`)
  4. Firebase 설정을 Service Worker에 전달
  5. Messaging 인스턴스 생성
  6. 알림 권한 요청 (`Notification.requestPermission()`)
  7. VAPID 키 확인
  8. FCM 토큰 획득 (`getToken()`)
- **반환값**: FCM 토큰 문자열 또는 `null`

##### `setupFCMMessageListener()`

- **역할**: 포그라운드 메시지 수신 리스너 설정
- **동작**:
  - `onMessage` 콜백 등록
  - 메시지 수신 시 `useFCMMessageStore`를 통해 모달 표시
  - 알림도 함께 표시 (선택사항)

##### `setupServiceWorkerMessageListener()`

- **역할**: Service Worker로부터 메시지 수신 리스너 설정
- **처리 이벤트**:
  - `FCM_BACKGROUND_MESSAGE`: 백그라운드 메시지
  - `FCM_NOTIFICATION_CLICK`: 알림 클릭 이벤트

---

### 3. `firebase-messaging-sw.js` (Service Worker)

#### 주요 기능

##### Firebase 초기화

```javascript
const initializeFirebase = (config) => {
  firebaseApp = firebase.initializeApp(config);
  messaging = firebase.messaging();
  setupMessageHandlers();
};
```

##### 백그라운드 메시지 처리

```javascript
messaging.onBackgroundMessage((payload) => {
  // 알림 표시
  self.registration.showNotification(title, options);

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

##### 알림 클릭 처리

```javascript
self.addEventListener("notificationclick", (event) => {
  // 기존 창 포커스 또는 새 창 열기
  // 메인 스레드로 페이로드 전달
});
```

---

### 4. `HomePage.tsx` 통합

#### FCM 초기화 로직

```typescript
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
    try {
      // 1. FCM 초기화 및 토큰 획득
      const token = await initializeFCM();

      if (token) {
        // 2. 서버에 토큰 등록
        await registerFCMToken(token, "WEB_PC");
        fcmInitialized.current = true;
      }

      // 3. 포그라운드 메시지 리스너 설정
      setupFCMMessageListener();
    } catch (error) {
      console.error("❌ [FCM] 초기화 오류:", error);
    }
  };

  setupFCM();
}, [user, location.pathname]);
```

---

## API 엔드포인트

### POST `/notification/notifications/fcm/token`

#### 요청

```typescript
{
  token: string; // FCM 토큰
  deviceType: string; // "WEB_PC" | "WEB_MOBILE" | "IOS" | "ANDROID"
}
```

#### 응답

```typescript
{
  success: boolean;
  message?: string;
}
```

#### 예시

```typescript
// 요청
POST /notification/notifications/fcm/token
Content-Type: application/json
Authorization: Bearer {accessToken}

{
  "token": "cDrOyXSUVXqTcRVfZ8yFLo:APA91bE...",
  "deviceType": "WEB_PC"
}

// 응답
{
  "success": true,
  "message": "FCM 토큰이 성공적으로 등록되었습니다."
}
```

---

## 사용 흐름

### 1. 사용자 로그인 후 홈 페이지 접속

```
사용자 로그인
    ↓
/home 페이지 접속
    ↓
HomePage.tsx 마운트
    ↓
useEffect 실행 (user && location.pathname === "/home")
```

### 2. FCM 초기화

```
initializeFCM() 호출
    ↓
브라우저 지원 확인
    ↓
Service Worker 등록 (/firebase-messaging-sw.js)
    ↓
Firebase 설정 전달
    ↓
알림 권한 요청 팝업 표시
    ↓
사용자가 "허용" 클릭
    ↓
FCM 토큰 획득 (getToken)
```

### 3. 토큰 서버 등록

```
registerFCMToken(token, "WEB_PC") 호출
    ↓
POST /notification/notifications/fcm/token
    ↓
서버에 토큰 저장
    ↓
성공 응답 수신
```

### 4. 메시지 수신 준비

```
setupFCMMessageListener() 호출
    ↓
포그라운드 메시지 리스너 등록
    ↓
백그라운드 메시지 리스너 등록 (Service Worker)
    ↓
알림 수신 준비 완료
```

### 5. 메시지 수신 시나리오

#### 포그라운드 (페이지가 열려있을 때)

```
FCM 메시지 수신
    ↓
onMessage 콜백 실행
    ↓
useFCMMessageStore.showMessage() 호출
    ↓
모달 팝업 표시
    ↓
알림도 함께 표시 (선택사항)
```

#### 백그라운드 (페이지가 닫혀있을 때)

```
FCM 메시지 수신
    ↓
Service Worker의 onBackgroundMessage 실행
    ↓
브라우저 알림 표시
    ↓
메인 스레드로 메시지 전달 (페이지가 열려있는 경우)
```

---

## 설정 방법

### 1. 환경 변수 설정

`.env` 파일에 다음 변수들을 설정합니다:

```env
# Firebase 설정
VITE_FIREBASE_API_KEY=AIzaSyAdvajxr9nwDEBFfuajsbDhuHuWdu0v4uk
VITE_FIREBASE_AUTH_DOMAIN=bebee-c4d61.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=bebee-c4d61
VITE_FIREBASE_STORAGE_BUCKET=bebee-c4d61.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1024519360208
VITE_FIREBASE_APP_ID=1:1024519360208:web:46d14c7ace75447756d8d5
VITE_FIREBASE_MEASUREMENT_ID=G-S2H4Q7TRCG

# VAPID 키 (필수) - FCM 웹 푸시에 반드시 필요
VITE_FIREBASE_VAPID_KEY=BKMar7C5AibZwabJemvInP7rEGBs3IoflOYQeXcC_RG7qTFRe6R1Rg5pzqnV1rcxIX8rEGec-jcm7C6I1TTnVA4
```

**⚠️ 중요 사항:**
- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 환경 변수 값에는 따옴표(`"`)나 쉼표(`,`)를 사용하지 마세요.
- 환경 변수를 변경한 후에는 **반드시 개발 서버를 재시작**해야 합니다.
- 프로덕션 환경에서는 서버의 환경 변수로 설정해야 합니다.

### 2. VAPID 키 발급 및 설정 방법

#### VAPID 키 발급

1. Firebase Console 접속: https://console.firebase.google.com/
2. 프로젝트 선택 (`bebee-c4d61`)
3. 프로젝트 설정 → 클라우드 메시징 탭
4. "웹 푸시 인증서" 섹션에서 키 쌍 생성
5. 생성된 키를 복사

#### VAPID 키 설정 방법

**방법 1: 환경 변수 파일에 설정 (권장)**

`.env` 파일에 다음 형식으로 추가:

```env
VITE_FIREBASE_VAPID_KEY=BKMar7C5AibZwabJemvInP7rEGBs3IoflOYQeXcC_RG7qTFRe6R1Rg5pzqnV1rcxIX8rEGec-jcm7C6I1TTnVA4
```

**주의사항:**
- `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 프로덕션 환경에서는 서버의 환경 변수로 설정해야 합니다.
- 값에 따옴표(`"`)나 쉼표(`,`)를 사용하지 마세요.

**방법 2: 코드에 직접 설정 (개발용, 임시)**

`src/hooks/useFirebaseHandler.ts` 파일에서 fallback으로 설정:

```typescript
const vapidKey =
  import.meta.env.VITE_FIREBASE_VAPID_KEY ||
  "BKMar7C5AibZwabJemvInP7rEGBs3IoflOYQeXcC_RG7qTFRe6R1Rg5pzqnV1rcxIX8rEGec-jcm7C6I1TTnVA4";
```

**⚠️ 주의:** 프로덕션 환경에서는 반드시 환경 변수를 사용하세요. 코드에 직접 하드코딩하는 것은 보안상 권장되지 않습니다.

#### 현재 프로젝트 VAPID 키

프로젝트에서 사용 중인 VAPID 키:
```
BKMar7C5AibZwabJemvInP7rEGBs3IoflOYQeXcC_RG7qTFRe6R1Rg5pzqnV1rcxIX8rEGec-jcm7C6I1TTnVA4
```

이 키는 `.env` 파일에 `VITE_FIREBASE_VAPID_KEY`로 설정되어 있습니다.

### 3. Service Worker 파일 확인

`public/firebase-messaging-sw.js` 파일이 존재하는지 확인합니다.

### 4. Firebase SDK 설치 확인

```bash
npm list firebase
```

필요한 경우:

```bash
npm install firebase
```

---

## 트러블슈팅

### 1. 토큰이 null로 반환되는 경우

#### 원인

- VAPID 키가 설정되지 않음
- 알림 권한이 거부됨
- Service Worker 등록 실패

#### 해결 방법

**1단계: VAPID 키 확인**

```typescript
// 브라우저 콘솔에서 확인
console.log("VAPID Key:", import.meta.env.VITE_FIREBASE_VAPID_KEY);
```

**문제:** `undefined` 또는 빈 문자열이 출력되는 경우

**해결:**
- `.env` 파일에 `VITE_FIREBASE_VAPID_KEY`가 올바르게 설정되어 있는지 확인
- 환경 변수 값에 따옴표(`"`)나 쉼표(`,`)가 포함되어 있지 않은지 확인
- 개발 서버를 재시작 (환경 변수 변경 시 필수)

**예시 (잘못된 형식):**
```env
# ❌ 잘못된 형식
VITE_FIREBASE_VAPID_KEY="BKMar7C5AibZwabJemvInP7rEGBs3IoflOYQeXcC_RG7qTFRe6R1Rg5pzqnV1rcxIX8rEGec-jcm7C6I1TTnVA4",
```

**예시 (올바른 형식):**
```env
# ✅ 올바른 형식
VITE_FIREBASE_VAPID_KEY=BKMar7C5AibZwabJemvInP7rEGBs3IoflOYQeXcC_RG7qTFRe6R1Rg5pzqnV1rcxIX8rEGec-jcm7C6I1TTnVA4
```

**2단계: 알림 권한 확인**

```typescript
const permission = Notification.permission;
console.log("Notification Permission:", permission);
// "default": 아직 요청하지 않음
// "granted": 허용됨
// "denied": 거부됨
```

**문제:** `"denied"`인 경우

**해결:**
- 브라우저 설정에서 알림 권한을 수동으로 허용해야 함
- Chrome: 설정 → 개인정보 및 보안 → 사이트 설정 → 알림
- 또는 시크릿 모드에서 테스트

**3단계: Service Worker 등록 확인**

```typescript
navigator.serviceWorker.getRegistration().then((reg) => {
  console.log("Service Worker Registration:", reg);
});
```

**4단계: 콘솔 오류 메시지 확인**

다음 오류가 나타나는 경우:
```
⚠️ VAPID 키가 설정되지 않았습니다. FCM 토큰을 가져올 수 없습니다.
```

→ `.env` 파일에 VAPID 키를 추가하고 개발 서버를 재시작하세요.

### 2. Service Worker 등록 실패

#### 원인

- 파일 경로가 잘못됨
- HTTPS가 아닌 환경 (localhost 제외)
- 브라우저가 Service Worker를 지원하지 않음

#### 해결 방법

- `public/firebase-messaging-sw.js` 파일 존재 확인
- 개발 환경에서는 `localhost` 사용
- 프로덕션 환경에서는 HTTPS 필수

### 3. 알림 권한 팝업이 나타나지 않는 경우

#### 원인

- 이미 권한이 요청되었고 거부됨
- 브라우저가 알림을 지원하지 않음

#### 해결 방법

```typescript
// 권한 상태 확인
const permission = Notification.permission;
// "default": 아직 요청하지 않음
// "granted": 허용됨
// "denied": 거부됨

// 거부된 경우 브라우저 설정에서 수동으로 허용해야 함
```

### 4. 백그라운드 메시지가 수신되지 않는 경우

#### 원인

- Service Worker가 제대로 등록되지 않음
- Firebase 설정이 Service Worker에 전달되지 않음

#### 해결 방법

1. 브라우저 개발자 도구 → Application → Service Workers 확인
2. Service Worker 콘솔 로그 확인
3. `firebase-messaging-sw.js`의 fallback 설정 확인

### 5. 토큰 서버 등록 실패

#### 원인

- 네트워크 오류
- 인증 토큰이 만료됨
- 서버 엔드포인트 오류

#### 해결 방법

```typescript
try {
  await registerFCMToken(token, "WEB_PC");
} catch (error) {
  console.error("토큰 등록 실패:", error);
  // 에러 처리 로직 추가
  // 예: 재시도, 사용자에게 알림 등
}
```

---

## 주의사항

### 1. HTTPS 필수 (프로덕션)

- FCM은 프로덕션 환경에서 HTTPS가 필수입니다.
- `localhost`는 개발 환경에서 허용됩니다.

### 2. VAPID 키 필수

- VAPID 키가 없으면 FCM 토큰을 획득할 수 없습니다.
- Firebase Console에서 반드시 발급받아야 합니다.
- `.env` 파일에 `VITE_FIREBASE_VAPID_KEY`로 설정해야 합니다.
- 환경 변수 값에는 따옴표(`"`)나 쉼표(`,`)를 사용하지 마세요.
- 환경 변수를 변경한 후에는 개발 서버를 재시작해야 합니다.

**현재 프로젝트 VAPID 키:**
```
BKMar7C5AibZwabJemvInP7rEGBs3IoflOYQeXcC_RG7qTFRe6R1Rg5pzqnV1rcxIX8rEGec-jcm7C6I1TTnVA4
```

**설정 확인 방법:**
```typescript
// 브라우저 콘솔에서 확인
console.log("VAPID Key:", import.meta.env.VITE_FIREBASE_VAPID_KEY);
```

만약 `undefined`가 출력되면:
1. `.env` 파일에 `VITE_FIREBASE_VAPID_KEY`가 올바르게 설정되어 있는지 확인
2. 개발 서버를 재시작
3. 값에 따옴표나 쉼표가 포함되어 있지 않은지 확인

### 3. 알림 권한 요청 타이밍

- 사용자가 명시적으로 액션을 취한 후에만 권한을 요청해야 합니다.
- 현재는 `/home` 페이지 접속 시 자동으로 요청합니다.
- 필요시 사용자 버튼 클릭 후 요청하도록 변경 가능합니다.

### 4. 토큰 갱신

- FCM 토큰은 변경될 수 있습니다.
- 토큰 변경 시 서버에 재등록해야 합니다.
- 현재는 초기화 시 한 번만 등록합니다.

### 5. 중복 초기화 방지

- `fcmInitialized.current`를 사용하여 중복 초기화를 방지합니다.
- 페이지 리로드 시 다시 초기화됩니다.

### 6. 브라우저 호환성

- Chrome, Firefox, Edge 등 주요 브라우저 지원
- Safari는 제한적 지원 (iOS Safari는 지원하지 않음)
- 브라우저 지원 확인 로직이 포함되어 있습니다.

### 7. Service Worker 범위

- Service Worker는 `/` 범위로 등록됩니다.
- 다른 경로의 Service Worker와 충돌하지 않도록 주의합니다.

### 8. 메시지 페이로드 구조

```typescript
{
  notification?: {
    title: string;
    body: string;
    icon?: string;
  };
  data?: Record<string, any>;
  messageId?: string;
  from?: string;
}
```

---

## 추가 개선 사항

### 1. 토큰 갱신 감지

```typescript
// onTokenRefresh 이벤트 리스너 추가
messaging.onTokenRefresh(async () => {
  const newToken = await getToken(messaging, { vapidKey });
  await registerFCMToken(newToken, "WEB_PC");
});
```

### 2. 사용자별 토큰 관리

- 여러 디바이스에서 로그인한 경우 각각의 토큰을 관리
- 로그아웃 시 토큰 삭제

### 3. 알림 권한 재요청

- 거부된 경우 사용자에게 설정 안내
- 설정 페이지로 이동하는 버튼 제공

### 4. 에러 핸들링 강화

- Toast 메시지를 통한 사용자 피드백
- 재시도 로직 추가

---

## 참고 자료

- [Firebase Cloud Messaging 문서](https://firebase.google.com/docs/cloud-messaging)
- [Web Push Notifications 가이드](https://web.dev/push-notifications-overview/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)

---

## 변경 이력

- **2025-01-XX**: FCM 토큰 등록 기능 초기 구현
  - `notificationApi.ts` 생성
  - `useFirebaseHandler.ts` 업데이트
  - `HomePage.tsx`에 통합
  - Service Worker 파일명 변경 (`firebase-message.js` → `firebase-messaging-sw.js`)
  - VAPID 키 설정 및 문서화
    - `.env` 파일에 `VITE_FIREBASE_VAPID_KEY` 추가
    - `useFirebaseHandler.ts`에 VAPID 키 fallback 설정
    - VAPID 키 발급 및 설정 방법 상세 문서화
    - 트러블슈팅 섹션에 VAPID 키 관련 문제 해결 방법 추가