/**
 * 모바일 웹 뷰포트 높이 유틸리티
 *
 * 모바일 브라우저의 주소창/툴바를 고려한 실제 뷰포트 높이를 계산하여
 * CSS 변수(--vh)로 설정 -> 모바일에서 스크롤 되는 문제 해결
 */

export const setViewportHeight = () => {
  // 실제 뷰포트 높이 계산
  const vh = window.innerHeight * 0.01;
  // CSS 변수로 설정 (--vh: 실제 픽셀 값)
  document.documentElement.style.setProperty("--vh", `${vh}px`);
};

/**
 * 뷰포트 높이를 주기적으로 업데이트
 * 모바일 브라우저에서 주소창이 사라지거나 나타날 때 대응
 *
 * @returns cleanup
 */
export const initViewportHeight = () => {
  setViewportHeight();

  const handleResize = () => {
    setViewportHeight();
  };

  window.addEventListener("resize", handleResize);
  window.addEventListener("orientationchange", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    window.removeEventListener("orientationchange", handleResize);
  };
};
