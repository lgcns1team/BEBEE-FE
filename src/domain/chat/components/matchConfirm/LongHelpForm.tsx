import { useState, useRef, forwardRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { TbMinusVertical } from "react-icons/tb";
import type { MatchPost } from "./matchPost";
import AddButton from "../../../../components/AddButton";
import {
  FieldSet,
  ModalLabel,
  ModalInput,
  RequiredMark,
} from "../../../../styles/FieldSetStyle";
interface LongHelpProps {
  editedPost: MatchPost;
  updateField: <K extends keyof MatchPost>(key: K, value: MatchPost[K]) => void;
}

interface WeekSchedule {
  day: string;
  start: Date | null;
  end: Date | null;
}

const DAYS = ["월", "화", "수", "목", "금", "토", "일"];

const LongHelpForm = ({ editedPost, updateField }: LongHelpProps) => {
  const required = true;
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    editedPost.periodStart || null,
    editedPost.periodEnd || null,
  ]);
  const [startDate, endDate] = dateRange;

  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [tempSchedule, setTempSchedule] = useState<WeekSchedule>({
    day: "월",
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0, 0)),
  });

  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const endTimeInputRef = useRef<HTMLInputElement>(null);
  const periodInputRef = useRef<HTMLInputElement>(null);

  const weeks = editedPost.weeks || [];

  // 날짜 범위 변경
  const handleDateRangeChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    updateField("periodStart", update[0]);
    updateField("periodEnd", update[1]);
  };

  // 요일 선택기 아이콘 클릭
  const handlePeriodIconClick = () => {
    periodInputRef.current?.click();
  };

  // 시간 선택기 아이콘 클릭
  const handleStartTimeIconClick = () => {
    startTimeInputRef.current?.click();
  };

  const handleEndTimeIconClick = () => {
    endTimeInputRef.current?.click();
  };

  // 스케줄 추가 모드 토글
  const handleAddScheduleClick = () => {
    setIsAddingSchedule(true);
    setTempSchedule({
      day: "월",
      start: new Date(new Date().setHours(10, 0, 0, 0)),
      end: new Date(new Date().setHours(12, 0, 0, 0)),
    });
  };

  // 스케줄 확인 (추가)
  const handleConfirmSchedule = () => {
    const newWeeks = [...weeks, tempSchedule];
    updateField("weeks", newWeeks);
    setIsAddingSchedule(false);
  };

  // 스케줄 삭제
  const handleDeleteSchedule = (index: number) => {
    const newWeeks = weeks.filter((_, i) => i !== index);
    updateField("weeks", newWeeks);
  };

  // 임시 스케줄 시간 변경
  const handleTempStartTimeChange = (date: Date | null) => {
    if (date) {
      setTempSchedule({ ...tempSchedule, start: date });
    }
  };

  const handleTempEndTimeChange = (date: Date | null) => {
    if (date) {
      setTempSchedule({ ...tempSchedule, end: date });
    }
  };

  return (
    <>
      <DatePickerGlobalStyle />
      {/* 도움 기간 */}
      <FieldSet>
        <ModalLabel>
          도움 기간{required && <RequiredMark>*</RequiredMark>}
        </ModalLabel>
        <DateInputWrapper>
          <CalendarIconWrapper onClick={handlePeriodIconClick}>
            <CiCalendar size={20} />
          </CalendarIconWrapper>
          <DatePicker
            selectsRange
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateRangeChange}
            dateFormat="yyyy.MM.dd"
            locale={ko}
            customInput={<StyledDateInput ref={periodInputRef} readOnly />}
          />
        </DateInputWrapper>
      </FieldSet>

      {/* 도움 요일 및 시간 */}
      <FieldSet>
        <ModalLabel>
          도움 요일 및 시간{required && <RequiredMark>*</RequiredMark>}
        </ModalLabel>

        {/* 추가된 스케줄 목록 */}
        {weeks.map((week, index) => (
          <ScheduleBox key={index}>
            <CloseButtonWrapper onClick={() => handleDeleteSchedule(index)}>
              <IoClose size={20} />
            </CloseButtonWrapper>
            <ScheduleContent>
              <DayBadge>{week.day}</DayBadge>
              <TimeText>
                {week.start
                  ? `${week.start
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${week.start
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : "--"}
                ~
                {week.end
                  ? `${week.end
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${week.end
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}`
                  : "--"}
              </TimeText>
            </ScheduleContent>
          </ScheduleBox>
        ))}

        {/* 스케줄 추가 모드 */}
        {isAddingSchedule ? (
          <AddScheduleBox>
            <ScheduleForm>
              {/* 요일 선택 */}
              <DaySelectWrapper>
                <DaySelect
                  value={tempSchedule.day}
                  onChange={(e) =>
                    setTempSchedule({ ...tempSchedule, day: e.target.value })
                  }
                >
                  {DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </DaySelect>
              </DaySelectWrapper>

              {/* 시작 시간 */}
              <TimeInputWrapper>
                <DatePicker
                  selected={tempSchedule.start}
                  onChange={handleTempStartTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat="HH:mm"
                  locale={ko}
                  customInput={
                    <StyledTimeInput ref={startTimeInputRef} readOnly />
                  }
                />
                <TimeIconWrapper onClick={handleStartTimeIconClick}>
                  <IoIosArrowDown size={20} />
                </TimeIconWrapper>
              </TimeInputWrapper>

              <TimeSeparator>~</TimeSeparator>

              {/* 끝 시간 */}
              <TimeInputWrapper>
                <DatePicker
                  selected={tempSchedule.end}
                  onChange={handleTempEndTimeChange}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat="HH:mm"
                  locale={ko}
                  customInput={
                    <StyledTimeInput ref={endTimeInputRef} readOnly />
                  }
                />
                <TimeIconWrapper onClick={handleEndTimeIconClick}>
                  <IoIosArrowDown size={20} />
                </TimeIconWrapper>
              </TimeInputWrapper>
            </ScheduleForm>

            <ButtonGroup>
              <CancelButton onClick={() => setIsAddingSchedule(false)}>
                취소
              </CancelButton>

              <TbMinusVertical size={20} color="#A1A1A1" />

              <ConfirmButton onClick={handleConfirmSchedule}>
                확인
              </ConfirmButton>
            </ButtonGroup>
          </AddScheduleBox>
        ) : (
          <AddButton onClick={handleAddScheduleClick} />
        )}
      </FieldSet>
    </>
  );
};

export default LongHelpForm;

// Styled-components

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
  background-color: ${({ theme }) => theme.color.white} !important;
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

const ScheduleBox = styled.div`
  position: relative;
  width: 100%;
  padding: 0.5rem;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.white};
`;

const CloseButtonWrapper = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.subText2};
  display: flex;
  align-items: center;
  padding: 0.25rem;
  z-index: 1;

  &:hover {
    color: ${({ theme }) => theme.color.text};
  }
`;

const ScheduleContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const DayBadge = styled.div`
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.color.subColor2};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;

const TimeText = styled.span`
  font-size: ${({ theme }) => theme.size.md} !important;
  font-weight: ${({ theme }) => theme.weight.regular} !important;
  color: ${({ theme }) => theme.color.text};
`;

const AddScheduleBox = styled.div`
  width: 100%;

  background-color: ${({ theme }) => theme.color.white};
`;

const ScheduleForm = styled.div`
  display: flex;
  align-items: center;
  gap: 0.2rem;
  margin-bottom: 1rem;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const DaySelectWrapper = styled.div`
  position: relative;
  align-items: center;
  justify-content: center;
`;

const DaySelect = styled.select`
  padding: 0 1rem;
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};

  border: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.main};
  }
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
  border: none !important;
  cursor: pointer;
  background-color: ${({ theme }) => theme.color.white} !important;
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

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 1px;
  border: none;
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.sm};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.color.subText2};
  }
`;

const ConfirmButton = styled.button`
  padding: 1px;
  border: none;
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.sm};
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.color.subText2};
  }
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
      background-color: ${({ theme }) => theme.color.subColor2} !important;
      color: ${({ theme }) => theme.color.text} !important;
    }

    // 달력_범위_시작_날짜
    &--in-selecting-range,
    &--in-range {
      background-color: ${({ theme }) => theme.color.subColor2} !important;
      color: ${({ theme }) => theme.color.text} !important;
    }

    // 달력_범위_끝_날짜
    &--range-end {
      background-color: ${({ theme }) => theme.color.main} !important;
      color: ${({ theme }) => theme.color.text} !important;
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
    &::-webkit-scrollbar {
      display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
