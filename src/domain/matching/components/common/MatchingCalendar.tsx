import React, { useState } from "react";
import DatePicker, {
  type ReactDatePickerCustomHeaderProps,
} from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import styled from "styled-components";
import { GoChevronRight } from "react-icons/go";
import { GoChevronLeft } from "react-icons/go";
const MyDatePicker = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const highlight = [
    {
      "react-datepicker__day--highlighted-custom-1": new Date(2025, 12, 10), // 12월 10일 강조
      "react-datepicker__day--highlighted-custom-2": new Date(2025, 11, 25), // 12월 25일 강조 (다른 스타일)
    },
  ];
  return (
    <StyledWrapper>
      <DatePicker
        inline
        selected={date}
        onChange={(d) => setDate(d)}
        locale={ko}
        dateFormat="yyyy년 MM월 dd일"
        highlightDates={[new Date("2025-12-06")]}
        renderCustomHeader={(props) => <CustomHeader {...props} />}
      />
    </StyledWrapper>
  );
};

export default MyDatePicker;

/* --------------------------
   🔵 Custom Header Component
--------------------------- */
const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
}: ReactDatePickerCustomHeaderProps) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 0-index → 1-index

  return (
    <HeaderContainer>
      <DateText>
        {year}년 {month}월
      </DateText>

      <ArrowGroup>
        <ArrowButton onClick={decreaseMonth}>
          <GoChevronLeft />
        </ArrowButton>
        <ArrowButton onClick={increaseMonth}>
          <GoChevronRight />
        </ArrowButton>
      </ArrowGroup>
    </HeaderContainer>
  );
};

/* --------------------------
   🔵 Styled-components
--------------------------- */
const StyledWrapper = styled.div`
  .react-datepicker {
    border: none;
    background-color: ${({ theme }) => theme.color.natural100};
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 왼쪽: 날짜, 오른쪽: 화살표 */
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 600;
  background-color: ${({ theme }) => theme.color.natural100};
`;

const DateText = styled.div``;

const ArrowGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ArrowButton = styled.button`
  padding: 4px 8px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
`;
