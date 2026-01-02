import { useState, useRef } from "react";
import { forwardRef } from "react";
import styled, { createGlobalStyle } from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { TbMinusVertical } from "react-icons/tb";

import AddButton from "../../../../components/AddButton";
import Layout from "../../../../components/Layout";
import GeneralInput from "../../../../components/GeneralInput";
import LocationInput from "../../../../components/LocationInput";
import BaseLongButton from "../../../../components/BaseLongButton";

import {
  FieldSet,
  ModalLabel,
  ModalInput,
  RequiredMark,
} from "../../../../styles/FieldSetStyle";
import { type PostCreateReqDTO } from "../../../../types/post.type";
import { usePostWrite } from "../../hook/usePostWrite";

interface DayProps {
  formData: Partial<PostCreateReqDTO>;
  updateField: (updates: Partial<PostCreateReqDTO>) => void;
}

import { SERVER_MAPPING, DAY_OF_WEEK_MAP } from "../../../../types/post.type";

// 컴포넌트 외부나 내부에서 요일 목록을 동적으로 생성
const DAYS_FROM_MAPPING = Object.keys(SERVER_MAPPING.DAYS);

const LongHelpWrite = ({ formData, updateField }: DayProps) => {
  const { utils, removeSchedule, handleSubmit, handleTermRangeChange } =
    usePostWrite(formData, updateField);

  // --- 로컬 상태 (일시적인 입력 관리) ---
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [tempSchedule, setTempSchedule] = useState({
    // 하드코딩된 "월" 대신 상수의 첫 번째 값을 기본값으로 사용
    day: DAYS_FROM_MAPPING[0],
    start: new Date(new Date().setHours(10, 0, 0)),
    end: new Date(new Date().setHours(12, 0, 0)),
  });

  const periodInputRef = useRef<HTMLInputElement>(null);
  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const endTimeInputRef = useRef<HTMLInputElement>(null);

  // --- 핸들러 ---
  const handleConfirmSchedule = () => {
    // UI의 한글 요일을 서버용 영문 요일로 변환
    const dayEn =
      SERVER_MAPPING.DAYS[tempSchedule.day as keyof typeof SERVER_MAPPING.DAYS];

    // 훅의 addSchedule을 활용하거나 직접 updateField 호출
    const newSchedule = {
      dayOfWeek: dayEn,
      startTime: utils.formatTime(tempSchedule.start),
      endTime: utils.formatTime(tempSchedule.end),
    };

    updateField({
      schedules: [...(formData.schedules || []), newSchedule],
    });
    setIsAddingSchedule(false);
  };

  return (
    <Layout>
      <DatePickerGlobalStyle />

      {/* 1. 도움 기간 (Range Picker) */}
      <FieldSet>
        <ModalLabel>
          도움 기간<RequiredMark>*</RequiredMark>
        </ModalLabel>
        <DateInputWrapper>
          <CalendarIconWrapper onClick={() => periodInputRef.current?.focus()}>
            <CiCalendar size={20} />
          </CalendarIconWrapper>
          <DatePicker
            selectsRange
            startDate={utils.getDateObj(formData.startDate)}
            endDate={utils.getDateObj(formData.endDate)}
            onChange={handleTermRangeChange}
            dateFormat="yyyy.MM.dd"
            locale={ko}
            minDate={new Date()}
            customInput={<StyledDateInput ref={periodInputRef} readOnly />}
          />
        </DateInputWrapper>
      </FieldSet>

      {/* 2. 도움 요일 및 시간 리스트 */}
      <FieldSet>
        <ModalLabel>
          도움 요일 및 시간<RequiredMark>*</RequiredMark>
        </ModalLabel>

        {formData.schedules?.map((schedule, index) => (
          <ScheduleBox key={index}>
            <CloseButtonWrapper onClick={() => removeSchedule(index)}>
              <IoClose size={20} />
            </CloseButtonWrapper>
            <ScheduleContent>
              <DayBadge>{DAY_OF_WEEK_MAP[schedule.dayOfWeek]}</DayBadge>
              <TimeText>
                {schedule.startTime.slice(0, 5)} ~{" "}
                {schedule.endTime.slice(0, 5)}
              </TimeText>
            </ScheduleContent>
          </ScheduleBox>
        ))}

        {/* 3. 스케줄 추가 폼 */}
        {isAddingSchedule ? (
          <AddScheduleBox>
            <ScheduleForm>
              <DaySelectWrapper>
                <DaySelect
                  value={tempSchedule.day}
                  onChange={(e) =>
                    setTempSchedule({ ...tempSchedule, day: e.target.value })
                  }
                >
                  {DAYS_FROM_MAPPING.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </DaySelect>
              </DaySelectWrapper>

              <TimeInputWrapper>
                <DatePicker
                  selected={tempSchedule.start}
                  // (time: Date | null)로 타입을 명시하거나 타입을 생략하여 추론하게 둡니다.
                  onChange={(date: Date | null) => {
                    if (date) {
                      setTempSchedule({ ...tempSchedule, start: date });
                    }
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat="HH:mm"
                  locale={ko}
                  customInput={
                    <StyledTimeInput ref={startTimeInputRef} readOnly />
                  }
                />
                <DatePicker
                  selected={tempSchedule.end}
                  onChange={(date: Date | null) => {
                    if (date) {
                      setTempSchedule({ ...tempSchedule, end: date });
                    }
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  dateFormat="HH:mm"
                  locale={ko}
                  customInput={
                    <StyledTimeInput ref={endTimeInputRef} readOnly />
                  }
                />
                <TimeIconWrapper
                  onClick={() => endTimeInputRef.current?.focus()}
                >
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
          <AddButton onClick={() => setIsAddingSchedule(true)} />
        )}
      </FieldSet>

      {/* 4. 기타 정보 */}
      <GeneralInput
        inputLabel="1회 제공 꿀"
        placeholder="1회 도움에 지급할 꿀을 입력해주세요."
        value={formData.unitHoney || ""}
        onChange={(e) => updateField({ unitHoney: Number(e.target.value) })}
        required
      />
      {/* 계산된 총액 표시 */}
      {formData.unitHoney ? (
        <TotlaHoney>
          <span style={{ color: "#155DFC" }}> 총 제공 꿀: </span>
          <span>
            총{" "}
            <span style={{ color: "#155DFC" }}>
              {formData.totalHoney?.toLocaleString()} 꿀
            </span>
            이 도우미에게 제공될 예정이에요
          </span>
        </TotlaHoney>
      ) : null}
      <LocationInput
        inputLabel="만남 장소"
        value={formData.region || ""}
        onSelect={(loc) =>
          updateField({
            region: loc.address,

            latitude: loc.lat,
            longitude: loc.lng,
          })
        }
        required
      />
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          marginTop: "20px",
          fontSize: "12px",
        }}
      >
        <strong>[데이터 확인용]</strong>
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      </div>
      <BaseLongButton label="작성 완료" onClick={handleSubmit} />
    </Layout>
  );
};

export default LongHelpWrite;
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
const TotlaHoney = styled.div`
  width: 100%;
  border: 0.5px solid ${({ theme }) => theme.color.blue500};
  background-color: ${({ theme }) => theme.color.blue50};
  padding: 8px 16px;
  font-size: ${({ theme }) => theme.size.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.color.subText2};
  margin-top: 12px;
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
