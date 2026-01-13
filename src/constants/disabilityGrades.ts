/**
 * 장애 등급 상수
 * - DB level 컬럼: VARCHAR(1)
 * - "1" = 중증 (장애의 정도가 심함)
 * - "2" = 경증 (장애의 정도가 심하지 않음)
 */
export const DISABILITY_GRADES = [
  { value: "1", label: "중증 (장애의 정도가 심함)" },
  { value: "2", label: "경증 (장애의 정도가 심하지 않음)" },
] as const;

export type DisabilityGrade = (typeof DISABILITY_GRADES)[number]["value"];
