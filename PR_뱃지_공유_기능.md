# 뱃지 공유 기능 구현

## 작업 내용

### 1. 뱃지 공유 페이지 생성

- `/badge/share` 경로 추가
- 뱃지 획득 축하 페이지 구현
- 사용자 이름 및 뱃지 정보 표시

### 2. 짧은 링크 생성

- Base64 인코딩을 사용한 URL 단축
- 한글 문자 안전 처리 (`encodeURIComponent` 사용)
- 링크 형식: `/badge/share?d={base64인코딩된데이터}`

### 3. 상장 스타일 디자인

- 금색 테두리 및 전통적인 상장 디자인
- 뱃지 이미지 중앙 배치
- "가입하기" 버튼으로 회원가입 유도

### 4. OpenGraph 메타 태그 설정

- 동적 메타 태그 생성 (`og:title`, `og:description`, `og:image` 등)
- Twitter Card 메타 태그 포함
- SNS 공유 시 미리보기 지원

### 5. 배포 환경 지원

- 프로덕션 환경에서 `https://be-bee.link` 도메인 사용
- 로컬 환경에서는 `window.location.origin` 사용

### 6. 뱃지 레벨별 표시 개선

- 5회 달성: "숙련자" 표시
- 10회 달성: "전문가" 표시
- BadgeDetailPage, StampCard, BadgeSharePage에 적용

### 7. BadgePreview 개선

- count가 높은 순으로 상위 5개만 표시
- `useBadgeStore` 통합으로 데이터 일관성 확보
- 뱃지 리소스 안전 처리 (없는 ID 필터링)

### 8. 폭죽 효과 애니메이션

- SVG 기반 폭죽 파티클 효과
- 80개 파티클, 3-5초 애니메이션
- 다양한 색상 및 크기 랜덤 생성

### 9. MyPage 스크롤 기능

- 스크롤 가능한 레이아웃 구조로 변경
- Header 고정, ContentArea 스크롤

---

## 팀원 가이드

### Member API 및 Store 사용법

#### 1. useMemberStore

**위치**: `src/store/useMemberStore.ts`

**용도**: 사용자의 상세 멤버 정보(프로필, 뱃지 등)를 관리하는 Zustand store

**주요 기능**:

```typescript
const { member, isLoading, error, fetchMember, setMember, clearMember } =
  useMemberStore();

// 멤버 정보 가져오기 (API 호출)
await fetchMember();

// 멤버 정보 직접 설정
setMember(memberData);

// 멤버 정보 초기화
clearMember();

// 멤버 정보 접근
const userName = member?.name;
const badges = member?.badges;
```

**데이터 구조**:

```typescript
interface Member {
  memberId: string;
  name: string;
  nickname: string;
  email: string;
  role: string;
  phoneNumber: string;
  introduction: string;
  latitude: number;
  longitude: number;
  profileImageUrl: string;
  sweetness: number;
  honeyPoint: number;
  addressRoad: string;
  gender: string;
  birthDate: string;
  ageGroup: number;
  helpTypes: string[];
  documents: object[];
  disabilityType: string;
  disabilityDescription: string;
  badges: Badge[] | null; // 뱃지 정보 포함
}

interface Badge {
  disabilityCategoryId: number;
  count: number;
  badgeCode: "LEVEL_1" | "LEVEL_2" | null;
}
```

**사용 예시**:

```typescript
import { useMemberStore } from "../../../store/useMemberStore";

const MyComponent = () => {
  const { member, isLoading, error, fetchMember } = useMemberStore();

  useEffect(() => {
    fetchMember();
  }, [fetchMember]);

  if (isLoading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  const userName = member?.name || "";
  const userBadges = member?.badges || [];
  const profileImage = member?.profileImageUrl;
};
```

---

#### 2. useBadgeStore

**위치**: `src/domain/Badge/store/useBadgeStore.ts`

**용도**: 뱃지 상태 정보를 관리하는 Zustand store (useMemberStore의 badges를 변환하여 사용)

**주요 기능**:

```typescript
const {
  badgeStatus, // BadgeStatusItem[]
  isLoading,
  error,
  fetchBadgeStatus,
  getBadgeStatusByDisabilityId,
} = useBadgeStore();

// 뱃지 상태 가져오기
await fetchBadgeStatus();

// 특정 장애 유형의 뱃지 상태 조회
const status = getBadgeStatusByDisabilityId(1); // 지체장애
```

**데이터 구조**:

```typescript
interface BadgeStatusItem {
  disabilityCategoryIds: number[];
  badge_code: "LEVEL_1" | "LEVEL_2" | null;
  count: number;
}
```

**사용 예시**:

```typescript
import { useBadgeStore } from "../store/useBadgeStore";

const BadgeComponent = () => {
  const {
    badgeStatus,
    isLoading,
    error,
    fetchBadgeStatus,
    getBadgeStatusByDisabilityId,
  } = useBadgeStore();

  useEffect(() => {
    fetchBadgeStatus();
  }, [fetchBadgeStatus]);

  // 특정 장애 유형의 뱃지 상태 조회
  const status = getBadgeStatusByDisabilityId(1); // 지체장애
  const count = status?.count || 0;
  const badgeCode = status?.badge_code || null;
  const isUnlocked = badgeCode !== null;

  // 모든 뱃지 상태 순회
  badgeStatus.forEach((item) => {
    console.log(item.disabilityCategoryIds, item.count, item.badge_code);
  });
};
```

---

#### 3. memberApi

**위치**: `src/api/memberApi.ts`

**주요 함수**:

```typescript
// 자신의 상세 멤버 정보 조회 (뱃지 정보 포함) - 권장
getMyMemberProfile(): Promise<AxiosResponse<Member>>

// 자신의 프로필 조회 (간단한 정보만)
getMyProfile(): Promise<AxiosResponse<MyProfile>>

// 타인의 프로필 조회
getMemberProfile(memberId: number | string): Promise<AxiosResponse<MemberProfile>>
```

**사용 예시**:

```typescript
import { getMyMemberProfile } from "../../../api/memberApi";

// 직접 API 호출 (Store 사용 권장)
const fetchData = async () => {
  try {
    const response = await getMyMemberProfile();
    const member = response.data;
    const badges = member.badges || [];
    const userName = member.name;
  } catch (error) {
    console.error("멤버 정보 조회 실패:", error);
  }
};
```

**주의사항**:

- Store를 사용하는 것을 권장합니다 (`useMemberStore`, `useBadgeStore`)
- 직접 API 호출이 필요한 경우에만 사용

---

#### 4. badgeApi

**위치**: `src/domain/Badge/api/badgeApi.ts`

**주요 함수**:

```typescript
// getMyMemberProfile에서 뱃지 정보 가져오기 (권장)
getBadgeFromMember(): Promise<BadgeResponse>

// 기존 API 엔드포인트 사용 (서버에 별도 엔드포인트가 있는 경우)
getBadge(): Promise<BadgeResponse>
```

**권장 사용법**:

- `useBadgeStore`를 사용하는 것을 권장합니다.
- 직접 API 호출이 필요한 경우 `getBadgeFromMember()` 사용

---

### 주요 변수 및 상수

#### DISABILITY_TYPES

**위치**: `src/constants/disabilityTypes.ts`

**구조**:

```typescript
export const DISABILITY_TYPES = [
  { id: 1, name: "지체장애" },
  { id: 2, name: "시각장애" },
  { id: 3, name: "청각장애" },
  { id: 4, name: "발달장애" },
  { id: 5, name: "내부기관장애" },
  { id: 6, name: "기타장애" },
] as const;
```

**사용 예시**:

```typescript
import { DISABILITY_TYPES } from "../../../constants/disabilityTypes";

const disability = DISABILITY_TYPES.find((d) => d.id === 1);
const disabilityName = disability?.name; // "지체장애"
```

---

#### BADGE_RESOURCE_MAP

**위치**: `src/domain/Badge/types/badge.type.ts`

**구조**:

```typescript
export const BADGE_RESOURCE_MAP: Record<
  number,
  Record<"LEVEL_1" | "LEVEL_2" | "DEFAULT", string>
> = {
  1: {
    LEVEL_1: badge1,
    LEVEL_2: badge1Level2,
    DEFAULT: bage1Disabled,
  },
  // ... id 2-5까지 동일한 구조
};
```

**주의사항**:

- 현재 id 1-5만 정의되어 있음
- id 6("기타장애")는 리소스가 없으므로 사용 시 안전 처리 필요

**사용 예시**:

```typescript
import { BADGE_RESOURCE_MAP } from "../types/badge.type";

const badgeResource = BADGE_RESOURCE_MAP[disabilityId];
if (!badgeResource) {
  // 리소스가 없는 경우 처리
  return null;
}

const badgeImage = badgeCode ? badgeResource[badgeCode] : badgeResource.DEFAULT;
```

---

### 데이터 흐름

```
getMyMemberProfile()
  ↓
Member.badges (Badge[])
  ↓
useBadgeStore.fetchBadgeStatus()
  ↓
BadgeStatusItem[] (변환)
  ↓
컴포넌트에서 사용
```

**변환 로직**:

```typescript
// Badge → BadgeStatusItem 변환
badges.map((badge) => ({
  disabilityCategoryIds: [badge.disabilityCategoryId],
  badge_code: badge.badgeCode as "LEVEL_1" | "LEVEL_2" | null,
  count: badge.count,
}));
```

---

### 주의사항

1. **뱃지 리소스 안전 처리**

   - `BADGE_RESOURCE_MAP`에 없는 ID가 있을 수 있음
   - 항상 `badgeResource` 존재 여부 확인 필요

2. **데이터 소스 통일**

   - 모든 뱃지 관련 컴포넌트는 `useBadgeStore` 사용 권장
   - `getMyMemberProfile()`이 단일 데이터 소스

3. **뱃지 레벨 표시**

   - 5회 달성: "숙련자"
   - 10회 달성: "전문가"
   - 공유 링크에도 레벨 정보 포함

4. **공유 링크 형식**
   - 짧은 링크: `/badge/share?d={base64인코딩데이터}`
   - 기존 형식 호환: `/badge/share?image=...&name=...`

---

## 트러블슈팅

### 1. 한글 인코딩 오류

**문제**: `btoa()`에서 한글 문자 처리 실패
**해결**: `encodeURIComponent`로 먼저 인코딩 후 `btoa()` 사용

### 2. 카카오톡 링크 스킴 오류

**문제**: 데스크톱에서 `kakaolink://` 스킴 미등록
**해결**: Web Share API → Kakao SDK → Clipboard 복사 순서로 fallback

### 3. 뱃지 리소스 undefined 오류

**문제**: `BADGE_RESOURCE_MAP`에 없는 ID 접근
**해결**: `badgeResource` 존재 여부 확인 후 early return

### 4. React Hooks 순서 오류

**문제**: early return 전에 hooks 호출
**해결**: 모든 hooks를 early return 전에 호출하도록 구조 변경
