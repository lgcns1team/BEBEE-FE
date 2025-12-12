import { useRef, useEffect, useState } from "react";
import { SNAP_POINTS, type SnapKey, pxToRem } from "../constants";

type SnapType = keyof typeof SNAP_POINTS;

export default function useMapBottomSheet() {
  const sheet = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [sheetY, setSheetY] = useState(0); // px 단위로 저장
  const [snap, setSnap] = useState<SnapType>("HALF");

  const applyTransform = (snapKey: SnapKey) => {
    const targetRem = SNAP_POINTS[snapKey];

    sheet.current!.style.transform = `translateY(${targetRem}rem)`;
    setSnap(snapKey);

    // 실제 화면 위치(px) 읽기
    requestAnimationFrame(() => {
      const rectTop = sheet.current!.getBoundingClientRect().top;
      setSheetY(rectTop); // px 그대로 저장
    });
  };

  const updateSnap = (next: SnapType) => {
    applyTransform(next);
  };

  const updateTransform = (snapKey: SnapKey) => {
    const targetY = SNAP_POINTS[snapKey];
    sheet.current!.style.transform = `translateY(${targetY}rem)`;
    setSnap(snapKey);

    // transform 적용 후 실제 위치 업데이트
    requestAnimationFrame(() => {
      const rectTop = sheet.current!.getBoundingClientRect().top;
      setSheetY(rectTop);
    });
  };

  useEffect(() => {
    updateTransform("HALF");
  }, []);

  const startY = useRef(0);
  const startSheetY = useRef(0);
  const dragging = useRef(false);

  const snapKeys: SnapKey[] = ["FULL", "HALF", "MIN"];

  /** 가장 가까운 스냅 찾기 */
  const getNearestSnap = (yRem: number): SnapKey => {
    let nearest: SnapKey = "HALF";
    let diff = Infinity;

    snapKeys.forEach((key) => {
      const d = Math.abs(SNAP_POINTS[key] - yRem);
      if (d < diff) {
        diff = d;
        nearest = key;
      }
    });
    return nearest;
  };

  const startDrag = (clientY: number) => {
    startY.current = clientY;

    const currentYpx = sheet.current!.getBoundingClientRect().y;
    startSheetY.current = pxToRem(currentYpx);

    dragging.current = true;
  };

  const moveDrag = (clientY: number, e: TouchEvent | MouseEvent) => {
    if (!dragging.current) return;

    e.preventDefault();

    const diffPx = clientY - startY.current;
    const diffRem = pxToRem(diffPx);

    let nextY = startSheetY.current + diffRem;

    if (nextY < SNAP_POINTS.FULL) nextY = SNAP_POINTS.FULL;
    if (nextY > SNAP_POINTS.MIN) nextY = SNAP_POINTS.MIN;

    sheet.current!.style.transform = `translateY(${nextY}rem)`;

    const rectTop = sheet.current!.getBoundingClientRect().top;
    setSheetY(rectTop); // px 단위로 저장
  };

  const endDrag = () => {
    if (!dragging.current) return;

    const currentYpx = sheet.current!.getBoundingClientRect().y;
    const currentYrem = pxToRem(currentYpx);

    const snapTarget = getNearestSnap(currentYrem);
    updateTransform(snapTarget);

    dragging.current = false;
  };

  /** 터치 이벤트 */
  useEffect(() => {
    const el = sheet.current!;
    const onTouchStart = (e: TouchEvent) => startDrag(e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => moveDrag(e.touches[0].clientY, e);
    const onTouchEnd = () => endDrag();

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  /** 마우스 이벤트 */
  useEffect(() => {
    const el = sheet.current!;

    const onMouseDown = (e: MouseEvent) => startDrag(e.clientY);
    const onMouseMove = (e: MouseEvent) => moveDrag(e.clientY, e);
    const onMouseUp = () => endDrag();

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const applySnap = (direction: "up" | "down") => {
    if (direction === "up") updateSnap("FULL");
    else updateSnap("HALF");
  };

  return {
    sheet,
    content,
    snap,
    updateSnap,
    sheetY,
  };
}
