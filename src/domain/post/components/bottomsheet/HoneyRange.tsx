// src/domain/post/components/filter/HoneyRange.tsx

import styled from "styled-components";
import { useRef, useState } from "react";
import { useFilterStore } from "../../../../store/useFilterStore";

const MAX_VALUE = 1000;

// 메인 페이지 바텀시트 내 회당 획득 꿀 범위 조절
const HoneyRange = () => {
  const { honeyRange, setHoneyRange } = useFilterStore();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  /** 공통 위치 업데이트 */
  const updatePosition = (clientX: number) => {
    if (!trackRef.current || !dragging) return;

    const rect = trackRef.current.getBoundingClientRect();
    let percent = (clientX - rect.left) / rect.width;

    percent = Math.max(0, Math.min(1, percent));
    const value = Math.round(percent * MAX_VALUE);

    if (dragging === "min" && value < honeyRange[1]) {
      setHoneyRange([value, honeyRange[1]]);
    }
    if (dragging === "max" && value > honeyRange[0]) {
      setHoneyRange([honeyRange[0], value]);
    }
  };

  /** 마우스 이동 */
  const onMouseMove = (e: MouseEvent) => updatePosition(e.clientX);

  /** 터치 이동 */
  const onTouchMove = (e: TouchEvent) => updatePosition(e.touches[0].clientX);

  /** 드래그 종료 */
  const stopDrag = () => {
    setDragging(null);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", stopDrag);
  };

  /** 드래그 시작 (마우스) */
  const startMouseDrag = (type: "min" | "max") => {
    setDragging(type);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", stopDrag);
  };

  /** 드래그 시작 (터치) */
  const startTouchDrag = (type: "min" | "max") => {
    setDragging(type);
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", stopDrag);
  };

  /** %로 변환된 위치 계산 */
  const leftPercent = (honeyRange[0] / MAX_VALUE) * 100;
  const rightPercent = (honeyRange[1] / MAX_VALUE) * 100;

  return (
    <Section>
      <Title>회당 획득 꿀</Title>

      <SliderWrapper>
        <Track ref={trackRef}>
          {/* active bar */}
          <ActiveBar
            style={{
              left: `${leftPercent}%`,
              width: `${rightPercent - leftPercent}%`,
            }}
          />

          {/* min handle */}
          <Handle
            style={{ left: `${leftPercent}%` }}
            onMouseDown={() => startMouseDrag("min")}
            onTouchStart={() => startTouchDrag("min")}
          />

          {/* max handle */}
          <Handle
            style={{ left: `${rightPercent}%` }}
            onMouseDown={() => startMouseDrag("max")}
            onTouchStart={() => startTouchDrag("max")}
          />
        </Track>

        <Scale>
          <span>0</span>
          <span>200</span>
          <span>500</span>
          <span>1000+</span>
        </Scale>
      </SliderWrapper>
    </Section>
  );
};

export default HoneyRange;

/* ---------------- styled-components ---------------- */

const Section = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
`;

const SliderWrapper = styled.div`
  width: 100%;
`;

const Track = styled.div`
  position: relative;
  height: 8px;
  background: var(--natural-100);
  border-radius: 8px;
`;

const ActiveBar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background: var(--main-color);
  border-radius: 8px;
`;

const Handle = styled.div`
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  background: var(--main-color);
  border-radius: 50%;
  border: 3px solid white;
  transform: translate(-50%, -50%);
  z-index: 10;
`;

const Scale = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: var(--main-color);
`;
