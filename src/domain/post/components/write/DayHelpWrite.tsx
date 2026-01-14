import styled from "styled-components";
import { useRef, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/locale";
import { parse } from "date-fns";
import { CiCalendar } from "react-icons/ci";
import { IoIosArrowDown } from "react-icons/io";

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
    <>
      <Container>
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
                // [수정 포인트] (time: Date | null) 이라고 명시적으로 타입을 적어줍니다.
                onChange={(time: Date | null) =>
                  handleDayTimeChange("startTime", time)
                }
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
                onChange={(time: Date | null) =>
                  handleDayTimeChange("endTime", time)
                }
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
      </Container>
      <BaseLongButton label="작성 완료" onClick={handleSubmit} />
    </>
  );
};

export default DayHelpWrite;

const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2rem 0;
  &::-webkit-scrollbar {
    display: none;
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
