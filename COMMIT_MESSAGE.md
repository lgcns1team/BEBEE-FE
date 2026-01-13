# 커밋 메시지

```
fix: 매칭 메시지 표시 개선 및 undefined/null 오류 방지

- 매칭 성사/거절 메시지의 textContent 제거 (채팅방에 텍스트로 표시되지 않도록)
- MatchSuccessCard와 MatchFailCard를 store에 메시지로 저장 (배포 환경에서도 유지)
- PayReceipt에 잔액 표시 추가
- undefined/null 오류 방지를 위한 안전한 배열 처리 추가
  - 채팅 메시지 배열 (useChatStore, useSocketStore)
  - 채팅방 목록 배열 (setChatrooms)
  - 게시글 목록 배열 (usePostStore, HomePage)
```
