// rem 변환 util
export const pxToRem = (px: number) => px / 16;

/**
 * 스냅 포인트(top 위치) — rem 단위
 * FULL: 가장 위
 * HALF: 중간
 * MIN : 아래쪽 peek
 */
export const SNAP_POINTS = {
  FULL: pxToRem(0), // 약 5rem 정도 위치
  HALF: pxToRem(375), // 중간 지점
  MIN: pxToRem(650), // 아래 peek 지점
} as const;

export type SnapKey = keyof typeof SNAP_POINTS;
export const SHEET_HEIGHT = {
  FULL: "90vh",
  HALF: "55vh",
  MIN: "30vh",
} as const;
