// ModalConfirm.tsx
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import "react-datepicker/dist/react-datepicker.css";
import BaseLongButton from "../../../components/BaseLongButton";
import { CiCalendar } from "react-icons/ci";
import { IoIosSearch } from "react-icons/io";
import { IoIosArrowDown } from "react-icons/io";

/* MUI date picker */
import "dayjs/locale/ko";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

interface MatchPost {
  type: string; // 수정 불가
  title: string; // 수정 불가
  date: string; // 수정 가능
  startTime: string; // 수정 가능
  endTime: string; // 수정 가능
  reward: number; // 수정 가능
  location: string; // 수정 가능
}
interface MatchModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MatchConfirmModal = ({ isOpen, setIsOpen }: MatchModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date("2025-12-01")
  );
  const [editedPost, setEditedPost] = useState<MatchPost>({
    type: "하루도움",
    title: "마트에서 장봐주실 분 구합니다",
    date: "2025-12-01",
    startTime: "10:00",
    endTime: "12:00",
    reward: 20000,
    location: "서울시 강남구 역삼동",
  });

  const navigate = useNavigate();

  return (
    <>
      {isOpen && (
        <ModalBackground onClick={() => setIsOpen(false)}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>매칭 확인서</ModalTitle>
              <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
            </ModalHeader>

            <FieldSet>
              <ModalInput value={editedPost.type} $editable={false} disabled />
            </FieldSet>

            <FieldSet>
              <ModalLabel>제목</ModalLabel>
              <ModalInput value={editedPost.title} $editable={false} disabled />
            </FieldSet>

            <FieldSet>
              <ModalLabel>도움 날짜</ModalLabel>

              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ko"
              >
                <DatePicker
                  value={dayjs(selectedDate)}
                  onChange={(newValue) => {
                    if (newValue) {
                      setSelectedDate(newValue.toDate());
                      const formatted = newValue.format("YYYY-MM-DD");
                      setEditedPost({ ...editedPost, date: formatted });
                    }
                  }}
                  format="YYYY.MM.DD"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        "& .MuiInputBase-root": {
                          borderRadius: "8px",
                          fontSize: "16px",
                          padding: "4px",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </FieldSet>

            <FieldSet>
              <ModalLabel>도움 시간</ModalLabel>
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ko"
              >
                <TimeWrapper>
                  <DesktopTimePicker defaultValue={dayjs("2022-04-17T15:30")} />
                  <span>~</span>
                  <DesktopTimePicker defaultValue={dayjs("2022-04-17T15:30")} />
                </TimeWrapper>
              </LocalizationProvider>
            </FieldSet>

            <FieldSet>
              <ModalLabel>1회 제공 꿀</ModalLabel>
              <ModalInput
                type="number"
                value={editedPost.reward}
                $editable={true}
                onChange={(e) =>
                  setEditedPost({
                    ...editedPost,
                    reward: Number(e.target.value),
                  })
                }
              />
            </FieldSet>

            <FieldSet>
              <ModalLabel>
                만남 장소{" "}
                <ModalInfoText>
                  게시글에는 행정동만 표시되니 안심하세요. 매칭 이후 도우미에게
                  보여질 장소예요
                </ModalInfoText>
              </ModalLabel>

              <LocationInputWrapper>
                <SearchIconWrapper>
                  <IoIosSearch size={20} />
                </SearchIconWrapper>
                <ModalInput
                  value={editedPost.location}
                  $editable={true}
                  onChange={(e) =>
                    setEditedPost({ ...editedPost, location: e.target.value })
                  }
                />
              </LocationInputWrapper>
            </FieldSet>
            <BaseLongButton label="확인" onClick={() => navigate("/chat")} />
          </ModalCard>
        </ModalBackground>
      )}
    </>
  );
};

export default MatchConfirmModal;

// Styled-components

const ModalBackground = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  z-index: 1000;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 340px;
  max-height: 80vh;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: 16px;
  padding: 16px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
`;

const ModalTitle = styled.h2`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const CloseButton = styled.button`
  font-size: ${({ theme }) => theme.size.lg};
  background: none;
  border: none;
  cursor: pointer;
`;

const FieldSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem; // label과 input/select 사이 간격
  margin-bottom: 2rem; // 세트 간 마진
`;

const TimeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
const ModalLabel = styled.label`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
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
const ModalInfoText = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  font-weight: ${({ theme }) => theme.weight.regular};
  margin-top: 0;
`;

const LocationInputWrapper = styled.div`
  position: relative;
  width: 100%;

  input {
    padding-left: 3rem;
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: ${({ theme }) => theme.color.subText2};
  display: flex;
  align-items: center;
`;
