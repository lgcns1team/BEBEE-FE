import React, { useState } from "react";
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { GoChevronRight, GoChevronLeft } from "react-icons/go";

const MonthlyCalendar = () => {
  const [date, setDate] = useState<Date | null>(null);

  // 날짜 두 번 클릭 시 선택 취소 기능
  const handleChange = (picked: Date | null) => {
    if (!picked) return;

    // 이미 선택된 날짜를 다시 클릭하면 취소
    if (date && date.toDateString() === picked.toDateString()) {
      setDate(null);
      return;
    }

    // 새로운 날짜 선택
    setDate(picked);
  };

  return (
    <StyledWrapper>
      <DatePicker
        inline
        locale={ko}
        selected={date}
        onChange={handleChange}
        renderCustomHeader={(props) => <CustomHeader {...props} />}
        shouldCloseOnSelect={false}
      />
    </StyledWrapper>
  );
};

export default MonthlyCalendar;

const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
}: ReactDatePickerCustomHeaderProps) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return (
    <HeaderContainer>
      <DateText>
        {year}년 {month}월
      </DateText>

      <ArrowGroup>
        <ArrowButton onClick={decreaseMonth}>
          <GoChevronLeft size={20} />
        </ArrowButton>
        <ArrowButton onClick={increaseMonth}>
          <GoChevronRight size={20} />
        </ArrowButton>
      </ArrowGroup>
    </HeaderContainer>
  );
};

/* --------------------------
   Styled-components
--------------------------- */
const StyledWrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.color.natural100};
  margin: 0 auto;
  width: 100%;
  max-width: 430px;
  padding-bottom: 8px;

  .react-datepicker__header {
    background-color: ${({ theme }) => theme.color.natural100};
    border-bottom: 0.5px solid ${({ theme }) => theme.color.natural200};
  }

  .react-datepicker {
    width: 100%;
    transform: scale(1);
    transform-origin: top center;
    border: none;
    width: 100%;
    background: transparent;
  }

  .react-datepicker__month-container {
    width: 100%;
  }

  /* 요일 전체 컨테이너 */
  .react-datepicker__day-names {
    justify-content: space-between;
    padding: 0 4px;
  }

  /* 요일 텍스트 */
  .react-datepicker__day-name {
    width: 36px;
    text-align: center;
    font-size: ${({ theme }) => theme.size.md};
    color: ${({ theme }) => theme.color.text};
  }

  /* 날짜 기본 스타일 */
  .react-datepicker__day {
    font-size: ${({ theme }) => theme.size.md};
    width: 36px;
    height: 36px;
    line-height: 36px;
    margin: 3px;
    background: transparent;
    border-radius: 50%;
    transition: all 0.2s ease;
  }

  /* 호버 효과 */
  .react-datepicker__day:hover {
    background: ${({ theme }) => theme.color.natural100};
    border-radius: 50%;
  }

  /* 오늘 날짜 스타일 */
  .react-datepicker__day--today {
    background-color: ${({ theme }) => theme.color.main};
    color: ${({ theme }) => theme.color.white};
    border-radius: 50%;
    font-weight: ${({ theme }) => theme.weight.medium};
  }

  /* 선택된 날짜 스타일 (main 컬러) */
  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background: ${({ theme }) => theme.color.main};
    color: ${({ theme }) => theme.color.white};
    border-radius: 50%;
    font-weight: ${({ theme }) => theme.weight.medium};
  }

  .react-datepicker__day--selected:hover,
  .react-datepicker__day--keyboard-selected:hover {
    background: ${({ theme }) => theme.color.main};
    color: ${({ theme }) => theme.color.white};
    border-radius: 50%;
    font-weight: ${({ theme }) => theme.weight.medium};
  }
  /* 다른 달의 날짜 */
  .react-datepicker__day--outside-month {
    color: ${({ theme }) => theme.color.subText3};
  }

  /* 비활성화된 날짜 */
  .react-datepicker__day--disabled {
    color: ${({ theme }) => theme.color.subText3};
    cursor: not-allowed;
  }

  .react-datepicker__day--disabled:hover {
    background: transparent;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 12px 8px;
  font-weight: ${({ theme }) => theme.weight.medium};
`;

const DateText = styled.div`
  margin-left: 16px;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
`;

const ArrowGroup = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.color.text};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.color.natural200};
  }

  &:active {
    background: ${({ theme }) => theme.color.natural200};
  }
`;
