// DayHelpForm.tsx
import { styled, createGlobalStyle } from "styled-components";
import { useRef } from "react";
import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";

import { CiCalendar } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";

import type { AgreementRequest } from "../../types/match.types";

interface DailyHelpFormProps {
  dayEngagement: {
    date: Date | null;
    startTime: Date | null;
    endTime: Date | null;
  };
  setDayEngagement: React.Dispatch<
    React.SetStateAction<{
      date: Date | null;
      startTime: Date | null;
      endTime: Date | null;
    }>
  >;
  agreementRequest: Partial<AgreementRequest>;
  updateField: <K extends keyof AgreementRequest>(
    key: K,
    value: AgreementRequest[K]
  ) => void;
}

const DayHelpForm = ({
  dayEngagement,
  setDayEngagement,
}: DailyHelpFormProps) => {
  const datePickerInputRef = useRef<HTMLInputElement>(null);
  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const endTimeInputRef = useRef<HTMLInputElement>(null);
  const required = true;

  const formatKoreanTimeForSr = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours < 12 ? "오전" : "오후";
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const minuteStr = minutes === 0 ? "" : ` ${minutes}분`;
    return `${period} ${displayHours}시${minuteStr}`;
  };
  /** 날짜 */
  const handleCalendarIconClick = () => {
    datePickerInputRef.current?.click();
  };

  const handleDateChange = (date: Date | null) => {
    setDayEngagement((prev) => ({ ...prev, date }));
  };

  /** 시간 */
  const handleStartTimeIconClick = () => {
    startTimeInputRef.current?.click();
  };

  const handleEndTimeIconClick = () => {
    endTimeInputRef.current?.click();
  };

  const handleStartTimeChange = (time: Date | null) => {
    setDayEngagement((prev) => ({ ...prev, startTime: time }));
  };

  const handleEndTimeChange = (time: Date | null) => {
    setDayEngagement((prev) => ({ ...prev, endTime: time }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
      <DatePickerGlobalStyle />
      <FieldSet role="group" aria-label="하루 도움 날짜 및 시간 입력">
        <ModalLabel>
          도움 날짜 {required && <RequiredMark>*</RequiredMark>}
          <span className="sr-only">필수 입력 항목입니다</span>
        </ModalLabel>
        <DateInputWrapper>
          <CalendarIconWrapper
            onClick={handleCalendarIconClick}
            aria-label="날짜 선택 캘린더 열기"
          >
            <CiCalendar size={20} aria-hidden="true" />
          </CalendarIconWrapper>

          <DatePicker
            selected={dayEngagement.date}
            onChange={handleDateChange}
            dateFormat="yyyy.MM.dd"
            locale={ko}
            customInput={
              <StyledDateInput
                ref={datePickerInputRef}
                readOnly
                aria-label="도움 날짜 선택"
              />
            }
          />
          <span className="sr-only">
            {dayEngagement.date
              ? `선택된 날짜: ${dayEngagement.date.toLocaleDateString("ko-KR")}`
              : "날짜를 선택해주세요"}
          </span>
        </DateInputWrapper>
      </FieldSet>

      <FieldSet role="group" aria-label="도움 시간 입력">
        <ModalLabel>
          도움 시간 {required && <RequiredMark>*</RequiredMark>}
          <span className="sr-only">필수 입력 항목입니다</span>
        </ModalLabel>
        <TimeWrapper>
          <TimeInputWrapper>
            <DatePicker
              selected={dayEngagement.startTime}
              onChange={handleStartTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeFormat="HH시 mm분"
              dateFormat="HH시 mm분"
              locale={ko}
              customInput={
                <StyledTimeInput
                  ref={startTimeInputRef}
                  readOnly
                  aria-label={
                    dayEngagement.startTime
                      ? `시작 시간 선택, 현재 ${formatKoreanTimeForSr(
                          dayEngagement.startTime
                        )} 선택됨`
                      : "시작 시간 선택"
                  }
                />
              }
            />
            <TimeIconWrapper
              onClick={handleStartTimeIconClick}
              aria-label="시작 시간 선택 드롭다운 열기"
            >
              <IoIosArrowDown size={20} aria-hidden="true" />
            </TimeIconWrapper>
            <span className="sr-only">
              {dayEngagement.startTime
                ? `선택된 시작 시간: ${formatKoreanTimeForSr(
                    dayEngagement.startTime
                  )}`
                : "시작 시간을 선택해주세요"}
            </span>
          </TimeInputWrapper>

          <TimeSeparator aria-label="시간 범위 구분">
            ~<span className="sr-only">부터</span>
          </TimeSeparator>

          <TimeInputWrapper>
            <DatePicker
              selected={dayEngagement.endTime}
              onChange={handleEndTimeChange}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeFormat="HH시 mm분"
              dateFormat="HH시 mm분"
              locale={ko}
              customInput={
                <StyledTimeInput
                  ref={endTimeInputRef}
                  readOnly
                  aria-label={
                    dayEngagement.endTime
                      ? `종료 시간 선택, 현재 ${formatKoreanTimeForSr(
                          dayEngagement.endTime
                        )} 선택됨`
                      : "종료 시간 선택"
                  }
                />
              }
            />
            <TimeIconWrapper
              onClick={handleEndTimeIconClick}
              aria-label="종료 시간 선택 드롭다운 열기"
            >
              <IoIosArrowDown size={20} aria-hidden="true" />
            </TimeIconWrapper>
            <span className="sr-only">
              {dayEngagement.endTime
                ? `선택된 종료 시간: ${formatKoreanTimeForSr(
                    dayEngagement.endTime
                  )}`
                : "종료 시간을 선택해주세요"}
            </span>
          </TimeInputWrapper>
        </TimeWrapper>
      </FieldSet>
    </div>
  );
};

export default DayHelpForm;

// Styled-components

const FieldSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; // label과 input/select 사이 간격
  margin-top: 2.5rem;
`;

const ModalLabel = styled.label`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;
const RequiredMark = styled.span`
  margin-left: 4px;
  color: ${({ theme }) => theme.color.red500};
`;

const ModalInput = styled.input<{ $editable?: boolean }>`
  width: 100%;
  font-size: ${({ theme }) => theme.size.md};
  padding: 1rem;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: 8px;
  background-color: ${({ $editable, theme }) =>
    $editable ? theme.color.white : theme.color.natural100};
  color: ${({ theme }) => theme.color.text};

  &:focus {
    outline: none; // 기본 파란 테두리 제거
    border-color: ${({ theme }) => theme.color.main}; // 포커스 테두리 색
  }
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TimeInputWrapper = styled.div`
  position: relative;
  flex: 1;
  width: 100%;

  .react-datepicker-wrapper {
    display: block !important;
    width: 100% !important;
  }

  .react-datepicker__input-container {
    display: block !important;
    width: 100% !important;
  }
`;

const StyledTimeInput = styled(
  forwardRef<HTMLInputElement, { $editable?: boolean; readOnly?: boolean }>(
    (props, ref) => <ModalInput {...props} $editable={true} ref={ref} />
  )
)`
  cursor: pointer;
  background-color: ${({ theme }) => theme.color.white};
`;

const TimeIconWrapper = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.color.subText2};
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 1;
`;

const TimeSeparator = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
  margin: 0 0.25rem;
`;

const DateInputWrapper = styled.div`
  position: relative;
  width: 100%;

  .react-datepicker-wrapper {
    display: block !important;
    width: 100% !important;
  }

  .react-datepicker__input-container {
    display: block !important;
    width: 100% !important;
  }
`;

const StyledDateInput = styled(
  forwardRef<HTMLInputElement, { $editable?: boolean; readOnly?: boolean }>(
    (props, ref) => <ModalInput {...props} $editable={true} ref={ref} />
  )
)`
  padding-left: 3rem !important;
  cursor: pointer;
  background-color: ${({ theme }) => theme.color.white};
`;

const CalendarIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.color.subText2};
  display: flex;
  align-items: center;
  cursor: pointer;
  z-index: 1;
`;

/* 달력 커스텀 */
const DatePickerGlobalStyle = createGlobalStyle`
  // 달력_전체_컨테이너
  .react-datepicker {
    font-family: inherit;
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1001 !important;
  }

  // 달력_포털_컨테이너
  .react-datepicker-popper {
    z-index: 1001 !important;
  }

  // 달력_헤더
  .react-datepicker__header {
    background-color: ${({ theme }) => theme.color.subColor};
    border-bottom: none;
    border-radius: ${({ theme }) => theme.borderRadius.md} ${({ theme }) =>
  theme.borderRadius.md} 0 0;
    padding: 16px 0;
  }

  // 달력_현재_월_텍스트
  .react-datepicker__current-month {
    color: ${({ theme }) => theme.color.text};
    font-weight: ${({ theme }) => theme.weight.medium};
    font-size: ${({ theme }) => theme.size.md};
    padding-bottom: 0.5rem;
  }

  // 달력_요일_헤더 (월, 화, 수...)
  .react-datepicker__day-name {
    color: ${({ theme }) => theme.color.text};
    font-weight: ${({ theme }) => theme.weight.medium};
    width: 2rem;
    line-height: 2rem;
    margin: 0.2rem;
  }

  // 달력_날짜_셀
  .react-datepicker__day {
    color: ${({ theme }) => theme.color.text};
    width: 2rem;
    line-height: 2rem;
    margin: 0.2rem;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    position: relative;

    &:hover {
      background-color: ${({ theme }) => theme.color.subColor2};
      border-radius: ${({ theme }) => theme.borderRadius.sm};
    }

    // 달력_선택된_날짜
    &--selected,
    &--keyboard-selected {
      background-color: ${({ theme }) => theme.color.main} !important;
      color: ${({ theme }) => theme.color.text} !important;
  
    }

    // 달력_오늘_날짜
    &--today {
      font-weight: ${({ theme }) => theme.weight.bold};
      border: 1px solid ${({ theme }) => theme.color.main};
    }

    // 달력_비활성화된_날짜
    &--disabled {
      color: ${({ theme }) => theme.color.subText3};
      cursor: not-allowed;
    }
  }

  // 달력_네비게이션_화살표 (< >)
  .react-datepicker__navigation {
    top: 0.75rem;
    &-icon::before {
      border-color: ${({ theme }) => theme.color.text};
      border-width: 2px 2px 0 0;
    }

    &:hover *::before {
      border-color: ${({ theme }) => theme.color.text};
    }
  }

  // 달력_삼각형_화살표 (포털 위치 표시용)
  .react-datepicker__triangle {
    display: none;
  }

  // 시간_선택기_컨테이너
  .react-datepicker__time-container {
    border-left: none;
  }

  // 시간_선택기만_사용할_때_헤더_숨기기
  .react-datepicker__time-container
    + .react-datepicker__header,
  .react-datepicker--time-only .react-datepicker__header {
    display: none;
  }

  // 시간_선택기_배경
  .react-datepicker__time {
    background-color: ${({ theme }) => theme.color.white};
  }

  // 시간_리스트_아이템 (각 시간 옵션)
  .react-datepicker__time-list-item {
    color: ${({ theme }) => theme.color.text};
    font-size: ${({ theme }) => theme.size.md};
    padding-left: 2.5rem !important;
    padding-right: 2.5rem !important;
    text-align: center !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    font-weight: ${({ theme }) => theme.weight.regular} !important;

    &:hover {
      background-color: ${({ theme }) => theme.color.subColor2} !important;
    }

    // 시간_선택된_아이템
    &--selected {
      background-color: ${({ theme }) => theme.color.main} !important;
      color: ${({ theme }) => theme.color.text} !important;
      font-weight: ${({ theme }) => theme.weight.medium} !important;

    }

    // 시간_비활성화된_아이템
    &--disabled {
      color: ${({ theme }) => theme.color.subText3};
      cursor: not-allowed;
    }
  }

  // 시간_리스트_스크롤바
  .react-datepicker__time-list {
    /* 스크롤바 숨기기 */
    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`;
