# 트러블슈팅 가이드

## 배포 환경에서 발생하는 undefined/null 오류 처리

### 문제 상황

배포 환경에서 데이터가 없을 때 다음과 같은 오류가 발생했습니다:

```
Uncaught TypeError: Cannot read properties of undefined (reading 'length')
```

이 오류는 배열이나 객체가 `undefined` 또는 `null`인 상태에서 `.length` 속성에 접근할 때 발생합니다.

### 원인 분석

1. **localStorage 데이터 손상**

   - localStorage에 저장된 데이터가 예상한 구조와 다를 수 있음
   - `messages` 필드가 배열이 아닌 경우
   - `room` 객체 자체가 `undefined` 또는 `null`인 경우

2. **초기 데이터 부재**

   - 앱 최초 실행 시 localStorage에 데이터가 없는 경우
   - 채팅방이 아직 생성되지 않은 경우

3. **API 응답 데이터 구조 불일치**
   - 서버에서 받은 메시지 배열이 예상과 다른 형식일 수 있음
   - `data.messages`가 배열이 아닌 경우

### 해결 방법

#### 1. `loadMessagesFromStorage` - 데이터 검증 강화

**문제점:**

- localStorage에서 파싱한 데이터의 구조를 검증하지 않음
- `room.messages`가 배열이 아닐 수 있음

**해결책:**

```typescript
const loadMessagesFromStorage = (): Record<...> => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);

      // 데이터 구조 검증
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        console.warn("⚠️ localStorage 데이터 형식이 올바르지 않음, 초기화");
        localStorage.removeItem(STORAGE_KEY);
        return {};
      }

      // 각 room의 구조 검증 및 정리
      const validated: Record<...> = {};
      Object.keys(parsed).forEach((key) => {
        const room = parsed[key];
        if (room && typeof room === 'object' && !Array.isArray(room)) {
          // messages가 배열인지 확인
          const messages = Array.isArray(room.messages) ? room.messages : [];
          validated[key] = {
            messages,
            messageHasNext: Boolean(room.messageHasNext),
            nextChatId: room.nextChatId || null,
          };
        }
      });

      return validated;
    }
  } catch (error) {
    console.error("❌ localStorage에서 메시지 복원 실패:", error);
    // 오류 발생 시 localStorage 초기화
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("localStorage 초기화 실패:", e);
    }
  }
  return {};
};
```

#### 2. `saveMessagesToStorage` - 안전한 저장

**문제점:**

- 저장 전 데이터 구조를 검증하지 않음
- `room.messages`가 배열이 아닐 수 있음

**해결책:**

```typescript
const saveMessagesToStorage = (messagesByChatroom: Record<...>) => {
  try {
    if (!messagesByChatroom || typeof messagesByChatroom !== 'object' || Array.isArray(messagesByChatroom)) {
      console.warn("⚠️ 저장할 메시지 데이터 형식이 올바르지 않음");
      return;
    }

    // 안전한 접근을 위한 검증 및 정리
    const validated: Record<...> = {};
    Object.keys(messagesByChatroom).forEach((key) => {
      const room = messagesByChatroom[key];
      if (room && typeof room === 'object' && !Array.isArray(room)) {
        validated[key] = {
          messages: Array.isArray(room.messages) ? room.messages : [],
          messageHasNext: Boolean(room.messageHasNext),
          nextChatId: room.nextChatId || null,
        };
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(validated));
  } catch (error) {
    console.error("❌ localStorage에 메시지 저장 실패:", error);
  }
};
```

#### 3. `fetchHistory` - 안전한 메시지 접근

**문제점:**

- `currentChatroomMessages.messages`가 배열이 아닐 수 있음
- 서버 메시지가 배열이 아닐 수 있음

**해결책:**

```typescript
// 안전한 접근 보장
const safeMessages = Array.isArray(currentChatroomMessages.messages)
  ? currentChatroomMessages.messages
  : [];

// 서버 메시지도 배열인지 확인
let serverMessages = Array.isArray(data?.messages) ? data.messages : [];

// 기존 메시지도 배열인지 확인
const existingMessages = Array.isArray(currentChatroomMessages.messages)
  ? currentChatroomMessages.messages
  : [];
```

#### 4. `addMessage` - 안전한 메시지 추가

**문제점:**

- `currentChatroomMessages.messages`가 배열이 아닐 수 있음

**해결책:**

```typescript
// 안전한 접근 보장
const safeMessages = Array.isArray(currentChatroomMessages.messages)
  ? currentChatroomMessages.messages
  : [];

// 중복 체크 시에도 안전하게 처리
const existingIds = new Set(safeMessages.map((m) => m?.id).filter(Boolean));
```

#### 5. `ChatRoomPage`의 `allMessages` - 안전한 배열 처리

**문제점:**

- `historyMessages`와 `socketMessages`가 배열이 아닐 수 있음
- `Date.now()` 사용으로 React 렌더링 규칙 위반

**해결책:**

```typescript
const allMessages = useMemo(() => {
  // 안전한 배열 초기화
  const safeHistoryMessages = Array.isArray(historyMessages)
    ? historyMessages
    : [];
  const safeSocketMessages = Array.isArray(socketMessages)
    ? socketMessages
    : [];

  // 모든 배열 접근 전 안전 체크
  const socketMessageIds = new Set(
    safeSocketMessages.map((msg) => msg?.id).filter(Boolean)
  );

  // Date.now() 대신 문자열 사용
  const uniqueKey = `socket-no-id-${msg.createdAt || "no-date"}-${
    msg.senderId || "unknown"
  }-${seenIds.size}`;

  // ...
}, [historyMessages, socketMessages]);
```

#### 6. `useSocketStore`의 `getMessages` 및 `addMessage` - 안전한 접근

**문제점:**

- `messagesByChatroom`이 `undefined`일 수 있음
- 배열이 아닌 경우 처리하지 않음

**해결책:**

```typescript
getMessages: (chatroomId: string) => {
  const state = get();
  if (!state.messagesByChatroom || !chatroomId) {
    return [];
  }
  const messages = state.messagesByChatroom[chatroomId];
  return Array.isArray(messages) ? messages : [];
},

addMessage: (msg, chatroomId) =>
  set((state) => {
    const targetId = chatroomId || msg?.chatroomId;
    if (!targetId || !msg) return state;

    // 안전한 접근 보장
    const currentMessages = state.messagesByChatroom?.[targetId];
    const safeCurrentMessages = Array.isArray(currentMessages)
      ? currentMessages
      : [];

    // ...
  }),
```

### 핵심 원칙

1. **항상 배열 체크**

   - `Array.isArray()` 사용
   - 배열이 아니면 빈 배열 `[]`로 대체

2. **Optional Chaining 활용**

   - `?.` 연산자로 안전한 접근
   - `??` 연산자로 기본값 제공

3. **데이터 검증**

   - localStorage에서 읽은 데이터는 항상 검증
   - 저장 전 데이터 구조 확인

4. **에러 처리**

   - try-catch로 예외 처리
   - 오류 발생 시 안전한 기본값 반환

5. **React 렌더링 규칙 준수**
   - 순수 함수 사용 (Date.now() 등 피하기)
   - 렌더링 중 부수 효과 없음

### 예방 방법

1. **TypeScript 타입 가드 활용**

   ```typescript
   const isChatMessage = (msg: unknown): msg is ChatMessage => {
     return typeof msg === "object" && msg !== null && "id" in msg;
   };
   ```

2. **유틸리티 함수 생성**

   ```typescript
   const safeArray = <T>(arr: unknown): T[] => {
     return Array.isArray(arr) ? arr : [];
   };
   ```

3. **초기값 명시**
   - 모든 상태에 명확한 초기값 설정
   - undefined/null 체크 후 기본값 제공

### 테스트 시나리오

1. **빈 localStorage**

   - 앱 최초 실행 시 오류 없이 동작하는지 확인

2. **손상된 localStorage 데이터**

   - 잘못된 형식의 데이터가 있어도 오류 없이 처리되는지 확인

3. **서버 응답 없음**

   - API 응답이 없거나 빈 배열일 때 오류 없이 처리되는지 확인

4. **네트워크 오류**
   - 네트워크 오류 시에도 앱이 크래시되지 않는지 확인

### 관련 파일

- `src/domain/chat/store/useChatStore.ts`
- `src/domain/chat/pages/ChatRoomPage.tsx`
- `src/store/useSocketStore.ts`

### 참고사항

- 모든 배열 접근 전 `Array.isArray()` 체크 필수
- localStorage 데이터는 항상 검증 후 사용
- undefined/null 체크는 Optional Chaining(`?.`) 활용
- 기본값은 Nullish Coalescing(`??`) 연산자로 제공

## HomePage 게시글 목록 오류 방지

### 문제 상황

HomePage에서 게시글 목록이 undefined일 때 오류가 발생할 수 있습니다.

### 발견된 문제점

1. **HomePage.tsx 48줄** - `posts.length` 직접 접근

   ```typescript
   // 문제: posts가 undefined면 오류 발생
   if (hasInitialized.current || (posts.length > 0 && !isLoading)) {
   ```

2. **usePostStore.ts 68줄** - `response.posts` 직접 할당

   ```typescript
   // 문제: response.posts가 undefined면 store에 undefined 저장
   posts: response.posts,
   ```

3. **usePostStore.ts 110줄** - 스프레드 연산자 사용
   ```typescript
   // 문제: response.posts가 undefined면 스프레드 연산자 오류
   posts: [...posts, ...response.posts],
   ```

### 해결 방법

```typescript
// HomePage.tsx
if (
  hasInitialized.current ||
  (Array.isArray(posts) && posts.length > 0 && !isLoading)
) {
  return;
}

// usePostStore.ts - fetchPosts
posts: Array.isArray(response.posts) ? response.posts : [],

// usePostStore.ts - fetchMorePosts
const safeNewPosts = Array.isArray(response.posts) ? response.posts : [];
const safeExistingPosts = Array.isArray(posts) ? posts : [];
posts: [...safeExistingPosts, ...safeNewPosts],
```

### 관련 파일

- `src/domain/post/pages/HomePage.tsx`
- `src/store/usePostStore.ts`
