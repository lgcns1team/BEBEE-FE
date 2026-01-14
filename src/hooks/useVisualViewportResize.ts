import { useEffect, useRef, type RefObject } from "react";

interface UseVisualViewportResizeOptions {
  scrollContainerRef: RefObject<HTMLDivElement>;
  fixedElementRef?: RefObject<HTMLElement>;
  containerRef?: RefObject<HTMLDivElement>; // ChatContainer ref
  keyboardOffset?: number; // 키보드 추가 기능 공간 (기본값: 40px)
}

/**
 * Visual Viewport API를 사용하여 키보드가 나타날 때 스크롤을 조정하는 훅
 * PWA 및 모바일 웹 환경에서 키보드가 나타날 때 고정된 요소(ChatRoomCard)가 보이도록 스크롤을 조정합니다.
 */
export const useVisualViewportResize = ({
  scrollContainerRef,
  fixedElementRef,
  containerRef,
  keyboardOffset = 40,
}: UseVisualViewportResizeOptions) => {
  const initialViewportHeightRef = useRef<number>(0);
  const isKeyboardVisibleRef = useRef<boolean>(false);

  useEffect(() => {
    // Visual Viewport API 지원 여부 확인
    if (!window.visualViewport) {
      console.warn("Visual Viewport API is not supported");
      return;
    }

    const handleVisualViewportResize = () => {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;

      const visualViewport = window.visualViewport;
      const currentViewportHeight = visualViewport.height;
      const viewportOffsetTop = visualViewport.offsetTop || 0;

      // 초기 viewport 높이 저장 (키보드가 나타나기 전)
      if (initialViewportHeightRef.current === 0) {
        initialViewportHeightRef.current = currentViewportHeight;
      }

      // 키보드가 나타났는지 확인 (viewport 높이가 줄어들었는지)
      const heightDifference =
        initialViewportHeightRef.current - currentViewportHeight;
      const isKeyboardVisible = heightDifference > 50; // 50px 이상 차이나면 키보드로 간주

      if (isKeyboardVisible && !isKeyboardVisibleRef.current) {
        // 키보드가 방금 나타난 경우
        isKeyboardVisibleRef.current = true;

        requestAnimationFrame(() => {
          // ChatContainer의 높이를 viewport 높이에 맞춰 조정
          if (containerRef?.current) {
            containerRef.current.style.height = `${currentViewportHeight}px`;
          }

          if (!fixedElementRef?.current) return;

          // ChatRoomCard를 상단에 고정 (top: 0 유지)
          const fixedElementRect =
            fixedElementRef.current.getBoundingClientRect();
          const fixedElementTop = fixedElementRect.top;

          // ChatRoomCard가 상단에서 벗어났으면 상단으로 이동
          // viewportOffsetTop을 고려하여 정확한 위치 계산
          if (Math.abs(fixedElementTop - viewportOffsetTop) > 1) {
            // document 스크롤을 조정하여 ChatRoomCard를 상단에 고정
            const scrollAdjustment = fixedElementTop - viewportOffsetTop;
            window.scrollBy({
              top: -scrollAdjustment,
              behavior: "instant" as ScrollBehavior,
            });
          }
        });
      } else if (isKeyboardVisible && isKeyboardVisibleRef.current) {
        // 키보드가 계속 표시되는 동안 ChatRoomCard 위치 유지
        requestAnimationFrame(() => {
          if (!fixedElementRef?.current) return;

          const fixedElementRect =
            fixedElementRef.current.getBoundingClientRect();
          const fixedElementTop = fixedElementRect.top;
          const viewportOffsetTop = visualViewport.offsetTop || 0;

          // ChatRoomCard가 상단에서 벗어났으면 상단으로 이동
          if (Math.abs(fixedElementTop - viewportOffsetTop) > 1) {
            const scrollAdjustment = fixedElementTop - viewportOffsetTop;
            window.scrollBy({
              top: -scrollAdjustment,
              behavior: "instant" as ScrollBehavior,
            });
          }
        });
      } else if (!isKeyboardVisible && isKeyboardVisibleRef.current) {
        // 키보드가 사라진 경우: ChatContainer 높이 복원
        if (containerRef?.current) {
          containerRef.current.style.height = "100%";
        }
        // 키보드가 사라진 경우
        isKeyboardVisibleRef.current = false;
        initialViewportHeightRef.current = currentViewportHeight;
      }
    };

    // Visual Viewport resize 이벤트 리스너 등록
    window.visualViewport.addEventListener(
      "resize",
      handleVisualViewportResize
    );
    window.visualViewport.addEventListener(
      "scroll",
      handleVisualViewportResize
    );

    // 초기 viewport 높이 저장
    initialViewportHeightRef.current = window.visualViewport.height;

    // Cleanup
    return () => {
      window.visualViewport?.removeEventListener(
        "resize",
        handleVisualViewportResize
      );
      window.visualViewport?.removeEventListener(
        "scroll",
        handleVisualViewportResize
      );
    };
  }, [scrollContainerRef, fixedElementRef, containerRef, keyboardOffset]);
};
