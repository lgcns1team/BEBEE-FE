# Toast 사용법

## 개요

Toast는 사용자에게 성공/실패 메시지를 표시하는 컴포넌트입니다. `alert` 대신 사용하는 것을 권장합니다.

## 기본 사용법

### 1. Store에서 showToast 함수 가져오기

```typescript
import { useToastStore } from "../../store/useToastStore";

const { showToast } = useToastStore();
```

또는 hook 없이 직접 호출:

```typescript
import { useToastStore } from "../../store/useToastStore";

useToastStore.getState().showToast("메시지", "SUCCESS");
```

### 2. Toast 메시지 표시하기

```typescript
// 성공 메시지
showToast("작업이 완료되었습니다.", "SUCCESS");

// 실패 메시지
showToast("작업에 실패했습니다.", "ERROR");

// 타입 생략 시 기본값은 "SUCCESS"
showToast("작업이 완료되었습니다.");
```

### 3. Toast 컴포넌트 렌더링

페이지 또는 레이아웃에 `<Toast />` 컴포넌트를 추가해야 메시지가 표시됩니다.

```typescript
import { Toast } from "../../components/Toast";

// 기본 위치 (하단)
<Toast />

// 상단에 표시
<Toast position="top" />
```

## 사용 예시

### API 호출 성공/실패 시

```typescript
import { useToastStore } from "../../store/useToastStore";
import { getErrorMessage } from "../../utils/error";

const MyComponent = () => {
  const { showToast } = useToastStore();

  const handleAction = async () => {
    try {
      await someApi();
      showToast("작업이 완료되었습니다.", "SUCCESS");
    } catch (error) {
      showToast(getErrorMessage(error, "작업에 실패했습니다."), "ERROR");
    }
  };

  return (
    <Layout>
      <Toast />
      {/* ... */}
    </Layout>
  );
};
```

### 로그아웃 처리 예시

```typescript
const handleLogout = async () => {
  try {
    await logoutUser(memberId);
    useToastStore.getState().showToast("로그아웃되었습니다.", "SUCCESS");

    // Toast가 표시되는 시간(2500ms) 후에 다음 작업 수행
    setTimeout(() => {
      clearUser();
      navigate("/login");
    }, 2500);
  } catch (error) {
    useToastStore.getState().showToast("로그아웃에 실패했습니다.", "ERROR");
  }
};
```

## 주요 특징

- **자동 사라짐**: Toast는 2.5초 후 자동으로 사라집니다.
- **위치 선택**: `position` prop으로 "top" 또는 "bottom" 지정 가능 (기본값: "bottom")
- **타입**: "SUCCESS" (파란색) 또는 "ERROR" (노란색)
- **애니메이션**: fadeIn/fadeOut 애니메이션 포함

## 주의사항

1. **Toast 컴포넌트 필수**: `showToast`를 호출해도 페이지에 `<Toast />` 컴포넌트가 없으면 메시지가 표시되지 않습니다.

2. **페이지 전환 시**: Toast가 표시된 후 페이지를 전환할 경우, Toast가 보이도록 적절한 딜레이를 주세요 (예: `setTimeout`).

3. **에러 메시지**: `getErrorMessage` 유틸리티를 사용하여 일관된 에러 메시지 형식을 유지하세요.

4. **alert 대신 사용**: 새로운 코드에서는 `alert` 대신 Toast를 사용하는 것을 권장합니다.
