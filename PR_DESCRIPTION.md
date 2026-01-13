# PR 작업 내용

## 주요 변경사항

### 1. 매칭 메시지 표시 개선

- 매칭 성사/거절 시 채팅방에 텍스트 메시지로 표시되지 않도록 `textContent`를 빈 문자열로 설정
- MatchSuccessCard와 MatchFailCard를 store에 메시지로 저장하여 배포 환경에서도 데이터 보장

### 2. 꿀 사용 영수증 개선

- PayReceipt에 잔액 표시 추가
- 매칭 수락 시 현재 꿀 잔액 조회하여 메시지에 포함

### 3. undefined/null 오류 방지

- 모든 배열 접근 전 `Array.isArray()` 체크 추가
- undefined/null이거나 배열이 아닌 경우 빈 배열 `[]`로 처리
- 적용 범위:
  - 채팅 메시지 배열 (useChatStore, useSocketStore, ChatRoomPage)
  - 채팅방 목록 배열 (setChatrooms)
  - 게시글 목록 배열 (usePostStore, HomePage)

## 수정 파일

- `src/domain/chat/hook/useMatchAgreement.ts`
- `src/domain/chat/components/PayReceipt.tsx`
- `src/domain/chat/components/MatchSuccessCard.tsx`
- `src/domain/chat/store/useChatStore.ts`
- `src/domain/chat/pages/ChatRoomPage.tsx`
- `src/store/useSocketStore.ts`
- `src/store/usePostStore.ts`
- `src/domain/post/pages/HomePage.tsx`
- `src/domain/chat/chat.types.ts`
