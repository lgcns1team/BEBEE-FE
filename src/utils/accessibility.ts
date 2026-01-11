/**
 * 접근성(Accessibility) 관련 유틸리티 함수
 *
 * 시각장애인 사용자를 위한 Screen Reader 접근성을 개선하기 위한 공통 유틸리티
 *
 * @note 모바일 웹 환경에서 개발 중입니다.
 * - 키보드 이벤트 핸들러(onKeyDown)는 외부 키보드 연결 시나 테스트 목적
 * - 모바일에서 가장 중요한 접근성 요소는 aria-label과 .sr-only
 */

import React, { type KeyboardEvent } from "react";

/**
 * 키보드 이벤트 핸들러 생성 함수
 *
 * Enter 키 또는 Space 키를 누르면 onClick 핸들러를 실행합니다.
 * 버튼, 클릭 가능한 요소에 키보드 접근성을 추가할 때 사용합니다.
 *
 * @note 모바일 웹 환경: 물리 키보드가 없으므로 이 함수는 외부 키보드 연결 시나
 * 접근성 테스트 도구 사용 시에만 의미가 있습니다. 모바일에서의 주요 접근성은
 * aria-label과 .sr-only 텍스트에 집중해야 합니다.
 *
 * @param handler - 실행할 함수
 * @param condition - 실행 조건 (선택사항, 기본값: true)
 * @returns onKeyDown 이벤트 핸들러
 *
 * @example
 * ```tsx
 * const handleClick = () => {
 *   console.log('클릭됨');
 * };
 *
 * <button
 *   onClick={handleClick}
 *   onKeyDown={createKeyboardHandler(handleClick)}
 * >
 *   확인
 * </button>
 * ```
 *
 * @example
 * ```tsx
 * // 조건부 실행
 * <button
 *   onClick={handleClick}
 *   onKeyDown={createKeyboardHandler(handleClick, !isLoading)}
 *   disabled={isLoading}
 * >
 *   {isLoading ? '로딩 중...' : '제출'}
 * </button>
 * ```
 */
export const createKeyboardHandler = (
  handler: () => void,
  condition: boolean = true
) => {
  return (e: KeyboardEvent<HTMLElement>) => {
    if ((e.key === "Enter" || e.key === " ") && condition) {
      e.preventDefault();
      handler();
    }
  };
};

/**
 * 접근성을 위한 버튼 Props 타입
 *
 * 버튼 컴포넌트에 접근성 속성을 쉽게 추가할 수 있도록 하는 타입입니다.
 */
export interface AccessibleButtonProps {
  /**
   * 버튼의 기능을 설명하는 텍스트 (aria-label)
   * 시각적으로 보이는 텍스트와 동일하거나 더 자세한 설명을 제공합니다.
   *
   * @example "메시지 전송하기"
   * @example "매칭 확인서 작성하기"
   */
  ariaLabel?: string;

  /**
   * Screen Reader용 추가 설명
   * 버튼의 동작에 대한 상세 설명을 제공합니다.
   * .sr-only 클래스를 사용하여 시각적으로는 숨겨지지만 스크린 리더는 읽습니다.
   *
   * @example "입력한 메시지를 전송합니다. Enter 키 또는 Space 키를 누르면 실행됩니다."
   */
  srOnlyText?: string;

  /**
   * 키보드 이벤트 핸들러를 자동으로 추가할지 여부
   * true로 설정하면 createKeyboardHandler를 사용하여 onKeyDown 핸들러를 자동으로 추가합니다.
   *
   * @default true
   */
  enableKeyboardHandler?: boolean;
}

/**
 * 접근성을 위한 버튼 속성 생성 함수
 *
 * 버튼에 접근성 속성(aria-label, onKeyDown, sr-only 텍스트)을 쉽게 추가할 수 있도록 합니다.
 *
 * @param props - AccessibleButtonProps
 * @param onClickHandler - 버튼 클릭 핸들러
 * @param disabled - 버튼 비활성화 상태 (선택사항)
 * @returns 접근성 속성이 포함된 객체
 *
 * @example
 * ```tsx
 * const handleClick = () => {
 *   console.log('클릭됨');
 * };
 *
 * const accessibilityProps = createAccessibleButtonProps({
 *   ariaLabel: "메시지 전송하기",
 *   srOnlyText: "입력한 메시지를 전송합니다. Enter 키 또는 Space 키를 누르면 실행됩니다."
 * }, handleClick);
 *
 * <button onClick={handleClick} {...accessibilityProps.props}>
 *   전송
 *   {accessibilityProps.srOnlyElement}
 * </button>
 * ```
 */
export const createAccessibleButtonProps = (
  props: AccessibleButtonProps,
  onClickHandler: () => void,
  disabled: boolean = false
) => {
  const { ariaLabel, srOnlyText, enableKeyboardHandler = true } = props;

  const result: {
    props: {
      "aria-label"?: string;
      onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    };
    srOnlyElement?: React.ReactElement;
  } = {
    props: {},
  };

  if (ariaLabel) {
    result.props["aria-label"] = ariaLabel;
  }

  if (enableKeyboardHandler) {
    result.props.onKeyDown = createKeyboardHandler(onClickHandler, !disabled);
  }

  if (srOnlyText) {
    result.srOnlyElement = React.createElement(
      "span",
      { className: "sr-only" },
      srOnlyText
    );
  }

  return result;
};

/**
 * Screen Reader용 텍스트 생성 함수
 *
 * .sr-only 클래스를 적용한 텍스트 요소를 생성합니다.
 *
 * @param text - Screen Reader에서 읽을 텍스트
 * @returns ReactElement
 *
 * @example
 * ```tsx
 * <button onClick={handleClick}>
 *   확인
 *   {createSrOnlyText("매칭 확인서를 수락합니다. Enter 키 또는 Space 키를 누르면 실행됩니다.")}
 * </button>
 * ```
 */
export const createSrOnlyText = (text: string): React.ReactElement => {
  return React.createElement("span", { className: "sr-only" }, text);
};

/**
 * 접근성을 위한 아이콘 Props 생성
 *
 * 장식용 아이콘에 aria-hidden="true" 속성을 추가합니다.
 *
 * @param props - 아이콘의 기본 props
 * @returns aria-hidden이 포함된 props
 *
 * @example
 * ```tsx
 * <Icon {...createAccessibleIconProps({ size: 20 })} />
 * ```
 */
export const createAccessibleIconProps = <T extends object>(
  props: T
): T & { "aria-hidden": boolean } => {
  return { ...props, "aria-hidden": true };
};
