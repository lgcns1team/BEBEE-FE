## 디렉토리명/파일명 컨벤션

### **📂 디렉토리명**

- 케밥케이스(kebab-case) 사용

### **📄 파일명**

1. 도메인 내부 파일

- 상위 디렉토리명을 prefix로 붙이고, 파스칼케이스(PascalCase)로 작성
- 예:
  `domain/post/components/list/PostListItem.tsx`

2. assets 내 리소스

- 케밥케이스(kebab-case) 사용
- icons/는 `ic_` prefix 고정

3. 도메인 전용 설정 파일

- {도메인명}.{역할}.ts 로 작성
- 역할 구분: constants, types, route 등

## 3. 도메인 구조 규칙 (예: solving 도메인)

### ✅ 최상위 도메인

- 각 도메인의 루트는 `src/domain/{domain}/` 디렉토리입니다.
- 루트 하위에는 다음과 같은 폴더를 둘 수 있습니다:
  - `components/`
  - `layouts/`
  - `hooks/`
  - `utils/`
  - `pages/`
  - 기타 필요에 따라 확장 가능
- 하위 폴더는 **common**과 **세부 도메인별 폴더**로 구분합니다.
  - common/은 도메인 내부에서 공통으로 사용하는 리소스를 관리하며, 반드시 존재합니다.
- 도메인 내 라우팅, 상수, 타입 정의 파일은 각각 하나씩만 생성합니다.
  - 상수와 enum은 `*.constants.ts` 파일에서 함께 관리합니다.

### 🚫 세부 도메인 제한

- 세부 도메인(live, review 등)은 그 하위에 `components`, `hooks` 등의 폴더를 직접 생성할 수 없습니다.
- 대신, 최상위 도메인의 각 폴더(`components`, `hooks`, `utils`, `constants`, `apis`, `layouts`) 안에 세부 도메인 이름(live, review)으로 하위 폴더를 만들어 관리합니다.

## 전체 구조 예시

```bash
src/
├── assets/
│   ├── icons/
│   ├── images/
│   └── lotties/
│
├── components/            // 전역 공용 컴포넌트
│   ├── Button/
│   ├── Modal/
│   └── ...
│── types/
│   ├── user.ts/
│   ├── post.ts/
│   └── ..
├── domain/
│   ├── auth/              // 로그인/회원가입
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── auth.types.ts
│   │   ├── auth.constants.ts
│   │   └── auth.route.ts
│   │
│   ├── post/              // 게시글 관련
│   │   ├── components/
│   │   │   |
│   │   │   ├── list/
│   │   │   ├── write/
│   │   │   └── detail/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── PostWritePage.tsx
│   │   │   └── PostDetailPage.tsx
│   │   ├── post.types.ts
│   │   ├── post.constants.ts
│   │   └── post.route.ts
│   │
│   ├── mypage/            // 마이페이지
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── MyPage.tsx
│   │   ├── mypage.types.ts
│   │   ├── mypage.constants.ts
│   │   └── mypage.route.ts
│   │
│   ├── matching/          // 매칭 현황
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── MatchingPage.tsx
│   │   ├── matching.types.ts
│   │   ├── matching.constants.ts
│   │   └── matching.route.ts
│   │
│   ├── review/            // 독립 리뷰 도메인
│   │   ├── components/
│   │   │   └── ReviewForm.tsx
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── ReviewPage.tsx
│   │   ├── review.types.ts
│   │   ├── review.constants.ts
│   │   └── review.route.ts
│   │
│   ├── map/               // 동네 지도
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── MapPage.tsx
│   │   ├── map.types.ts
│   │   ├── map.constants.ts
│   │   └── map.route.ts
│   │
│   ├── chat/              // 채팅
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   │   └── ChatPage.tsx
│   │   ├── chat.types.ts
│   │   ├── chat.constants.ts
│   │   └── chat.route.ts
│   │
│   └ notification/    //알림
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── notification.types.ts
│       ├── notification.constants.ts
│       └── notification.route.ts
│
├── hooks/                 // 전역 공용 훅
├── layouts/               // 전역 레이아웃 (헤더)
src/
├── api/
│   ├── axiosInstance.ts   # (공통) BaseURL, Interceptor 설정
│   ├── postApi.ts         # 게시글 관련 API 모음
│   ├── userApi.ts         # 유저 관련 API 모음
│   └── ...
├── stores/
│   ├── usePostStore.ts    # 게시글 작성 폼, UI 상태 관리
│   ├── useUserStore.ts    # 로그인 유저 정보 관리
│   └── useSocketStore.ts  # (예외) 소켓 연결 및 이벤트 관리
└── types/
    └── post.ts            # 타입 정의는 별도 관리
├── utils/
├── app.constants.ts
└── index.tsx

```

## 1️⃣ 공통 컨벤션(JSX , TSX)

### 1-1) 디렉토리명 / 파일명 규칙

**📁 디렉토리명**

- **kebab-case 사용**
- 예시
  - ✔️ `hello-world`
  - ❌ `helloWorld`

### 📝 컴포넌트 파일명

- **PascalCase 사용**
- 예: `UserCard.jsx`, `UserCard.tsx`
- 스타일컴포넌트: 레이아웃/기능이 드러나도록 네이밍

### 🔧 함수/변수명

- **camelCase (소문자 시작)**
- 예: `helloWorld`, `getUser`, `addHoney`

### 🪝 훅 파일명

- `use-접두사`, camelCase
- 예: `useToggle.ts`, `useInput.js`

### 📂 store 파일

- `/src/store` 고정
- **camelCase 사용**
- 예: `userStore.ts`, `matchingStore.ts`

### **1-2) 프로젝트 구조 (트리) 예시**

```jsx
src/
 ├─ components/
 ├─ pages/
 ├─ layouts/
 ├─ hooks/
 ├─ store/
 ├─ api/
 ├─ utils/
 ├─ constants/
 ├─ types/   ← TSX일 경우
 ├─ assets/
 ├─ styles/
 └─ routers/

```

### 1-3) **컴포넌트 구조 규칙**

```jsx
1) import
2) 상수/타입(interface/type) ← TSX만 해당
3) 컴포넌트 내부 상태 (state, hooks)
4) 함수 선언 (핸들러)
5) return (JSX)

```

### 1-4) **JSX 작성 스타일**

- self-closing 태그는 반드시 self-closing
  - `<Button />`
  - `<img />`

---

### 1-5) **상태 관리 규칙 (Zustand)**

- 위치: `src/store`
- action 네이밍 규칙:
  - `add`, `update`, `remove`, `fetch`, `set`

---

### 1-6) **함수 네이밍 규칙**

### 🟦 기본 규칙

- 함수가 수행하는 역할을 한 줄로 간단하게 주석으로 설명한다.
- 약어는 사용하지 않는다.
- 변수/함수: camelCase
  예) `helloWorld`

### 🟩 역할별 규칙

- 이벤트 핸들러: **handle**
  - `handleClick`, `handleSubmit`
- 생성: **create**
  - `createUser`
- 변환: **convert**
  - `convertDate`
- 특정 값 반환: **get**
  - `getHoneyPoint`
- 더하기/빼기: **add / minus**
  - `addHoney`, `minusHoney`
- 필터링: **filter**
- 배열에서 찾기: **find**
  - `findUserById`
- 배열 변환: **convert**
  - `convertUserList`

### 🟧 boolean 규칙

- boolean 변수/함수는 `is`,`has`로 시작
  - is: 어떤 상태나 성질을 표현할 때 / has: 어떤 속성이나 권한 보유
  - `isActive`, `isHelper`, `isDisabledUser` ,`hasItems`

### 🟥 상수 규칙

- **대문자 스네이크케이스**
  - `HELLO_WORLD`, `DEFAULT_PAGE_SIZE`

---

### 1-7) **props 순서 규칙**

1. boolean 값
2. 기타 값(color, size, id 등)
3. 핸들러(onClick, onSubmit 등)

예)

```jsx
<Button primary size="lg" id="submitButton" onClick={handleClick} />
```

### **1-8) import 정렬 규칙**

```jsx
1. React 라이브러리 (react)
2. 외부 라이브러리
3. 내부 컴포넌트
4. hooks
5. store
6. utils
7. 스타일
8.이미지/asset

```

### 1-9) **CSS/Tailwind 규칙**

레이아웃 → 박스 → 타이포 → 컬러 → 효과 → 애니메이션

```jsx
"flex items-center gap-4 p-4 text-lg font-bold text-yellow-600 hover:opacity-90";
```

## 📢 State & API 컨벤션 (서버 배포 이후)

우리 프로젝트의 유지보수성과 코드 일관성을 위해 아래와 같이 작성 규칙을 정했습니다. 개발 시 참고해 주세요!

---

### 1. 폴더 구조

```
src/
├── api/
│   ├── axiosInstance.ts   # (공통) BaseURL, Interceptor 설정
│   ├── postApi.ts         # 게시글 관련 API 모음
│   ├── userApi.ts         # 유저 관련 API 모음
│   └── ...
├── stores/
│   ├── usePostStore.ts    # 게시글 작성 폼, UI 상태 관리
│   ├── useUserStore.ts    # 로그인 유저 정보 관리
│   └── useSocketStore.ts  # (예외) 소켓 연결 및 이벤트 관리
└── types/
    └── post.ts            # 타입 정의는 별도 관리
```

---

### 2. API 작성 규칙

API 폴더는 **"서버와 통신하여 데이터를 주고받는 역할"**만 수행합니다.

1. **공통 인스턴스 사용**: 모든 API 요청은 `src/utils/axiosInstance.ts`에서 export한 `instance`를 사용합니다. (헤더, 토큰 자동 처리 위함)
2. **도메인별 파일 분리**: `postApi.ts`, `authApi.ts` 처럼 도메인 단위로 파일을 나눕니다.
3. **함수명 규칙**: 동사+목적어 형태로 작성합니다.
   - 조회: `getPost`, `getPostList`
   - 생성: `createPost`
   - 수정: `updatePost`
   - 삭제: `deletePost`

---

### 3. Store 작성 규칙 (

**API 호출 금지** : Store의 `actions` 내부에서 직접 API를 호출하지 않습니다.

- _예외: `useSocketStore`는 연결 유지를 위해 Store 내에서 통신 로직을 포함합니다._
- 이외에도 예외 상황 발생 시 말씀해주세요 !

```tsx
// src/stores/usePostStore.ts
// ⭕️ : 오직 상태 변경 로직만 존재
setTitle: (title) => set((state) => ({ formData: { ...state.formData, title } })),`

// ❌ : Store 안에서 비동기 통신까지 다 하려고 함
submitPost: async () => {
  const result = await axios.post(...);
  set({ data: result });
}
```
