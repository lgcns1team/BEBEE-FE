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

// 선택할 때 용이
export const HELP_TAG_LIST = HELP_TAG_NAMES.map((name, index) => ({
  id: index + 1,
  name: name,
}));

//렌더링 용
export const HELP_TAG_MAP: Record<number, string> = Object.fromEntries(
  HELP_TAG_LIST.map(({ id, name }) => [id, name])
);
export type HelpTagType = (typeof HELP_TAG_LIST)[number];

export const HELP_TAGS = [
  "외출 동행",
  "방문 목욕",
  "방문 간호",
  "가사 지원",
  "정서적 지원",
  "식사 도움",
  "학습 지원",
  "기타 지원",
] as const;
