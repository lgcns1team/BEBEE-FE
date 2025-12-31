import { styled, createGlobalStyle } from "styled-components";
import { useRef, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { parse } from "date-fns";
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";

import Layout from "../../../../components/Layout";
import GeneralInput from "../../../../components/GeneralInput";
import LocationInput from "../../../../components/LocationInput";
import BaseLongButton from "../../../../components/BaseLongButton";
import { type PostCreateReqDTO } from "../../../../types/post.type";
import {
  FieldSet,
  ModalLabel,
  ModalInput,
  RequiredMark,
} from "../../../../styles/FieldSetStyle";
import { usePostWrite } from "../../hook/usePostWrite";
interface DayProps {
  formData: Partial<PostCreateReqDTO>;
  updateField: (updates: Partial<PostCreateReqDTO>) => void;
}

const DayHelpWrite = ({ formData, updateField }: DayProps) => {
  const datePickerInputRef = useRef<HTMLInputElement>(null);
  const startTimeInputRef = useRef<HTMLInputElement>(null);
  const endTimeInputRef = useRef<HTMLInputElement>(null);
  const { handleDayDateChange, handleDayTimeChange, handleSubmit } =
    usePostWrite(formData, updateField);

  /* ---------------- 3. Picker 표시용 데이터 변환 ---------------- */
  const selectedDate = formData.date ? new Date(formData.date) : null;
  const selectedStartTime = formData.schedules?.[0]?.startTime
    ? parse(formData.schedules[0].startTime, "HH:mm:ss", new Date())
    : null;
  const selectedEndTime = formData.schedules?.[0]?.endTime
    ? parse(formData.schedules[0].endTime, "HH:mm:ss", new Date())
    : null;

  return (
    <Layout>
      <DatePickerGlobalStyle />

      {/* 날짜 선택 */}
      <FieldSet>
        <ModalLabel>
          도움 날짜<RequiredMark>*</RequiredMark>
        </ModalLabel>
        <DateInputWrapper>
          <CalendarIconWrapper
            onClick={() => datePickerInputRef.current?.focus()}
          >
            <CiCalendar size={20} />
          </CalendarIconWrapper>
          <DatePicker
            selected={selectedDate}
            onChange={handleDayDateChange}
            dateFormat="yyyy.MM.dd"
            locale={ko}
            minDate={new Date()}
            customInput={<StyledDateInput ref={datePickerInputRef} readOnly />}
          />
        </DateInputWrapper>
      </FieldSet>

      {/* 시간 선택 */}
      <FieldSet>
        <ModalLabel>
          도움 시간<RequiredMark>*</RequiredMark>
        </ModalLabel>
        <TimeWrapper>
          <TimeInputWrapper>
            <DatePicker
              selected={selectedStartTime}
              onChange={(time) => handleDayTimeChange("startTime", time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              dateFormat="HH:mm"
              locale={ko}
              customInput={<StyledTimeInput ref={startTimeInputRef} readOnly />}
            />
            <TimeIconWrapper onClick={() => startTimeInputRef.current?.focus()}>
              <IoIosArrowDown size={20} />
            </TimeIconWrapper>
          </TimeInputWrapper>
          <TimeSeparator>~</TimeSeparator>
          <TimeInputWrapper>
            <DatePicker
              selected={selectedEndTime}
              onChange={(time) => handleDayTimeChange("endTime", time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              dateFormat="HH:mm"
              locale={ko}
              customInput={<StyledTimeInput ref={endTimeInputRef} readOnly />}
            />
            <TimeIconWrapper onClick={() => endTimeInputRef.current?.focus()}>
              <IoIosArrowDown size={20} />
            </TimeIconWrapper>
          </TimeInputWrapper>
        </TimeWrapper>
      </FieldSet>

      {/* 꿀 보상 */}
      <GeneralInput
        inputLabel="제공할 꿀"
        placeholder="지급할 꿀을 입력해주세요."
        value={formData.unitHoney || ""}
        onChange={(e) => {
          const val = Number(e.target.value);
          updateField({ unitHoney: val, totalHoney: val }); // DAY는 단발성이므로 동일
        }}
        required
      />

      {/* 장소 입력 */}
      <LocationInput
        inputLabel="만남 장소"
        infoText="행정동 단위까지만 공개되니 안심하세요."
        value={formData.region || ""}
        onSelect={(location) =>
          updateField({
            region: location.address,
            latitude: location.lat,
            longitude: location.lng,
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

export default DayHelpWrite;

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
