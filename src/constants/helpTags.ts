export const HELP_TAG_NAMES = [
  "외출 동행",
  "방문 목욕",
  "방문 간호",
  "가사 지원",
  "정서적 지원",
  "식사 도움",
  "학습 지원",
  "기타 지원",
] as const;

// 서버와 통신할 때 사용할 객체 형태의 맵핑 리스트
export const HELP_TAG_LIST = HELP_TAG_NAMES.map((name, index) => ({
  id: index + 1, // 1부터 시작하는 ID 부여
  name: name,
}));

export type HelpTagType = (typeof HELP_TAG_LIST)[number];

//용재님 용
export const HELP_TAGS = [
  "외출 동행",
  "방문 목욕",
  "방문 간호",
  "가사 지원",
  "정서적 지원",
  "식사 도움",
  "학습 지원",
  "기타 지원",
];
