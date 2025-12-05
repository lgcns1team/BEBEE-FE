import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { IoIosSearch } from "react-icons/io";
import DayHelpForm from "./DayHelpForm";
import LongHelpForm from "./LongHelpForm";
import BaseLongButton from "../../../../components/BaseLongButton";

import type { MatchPost } from "./matchPost";

interface MatchProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

// 👉 지금은 서버X, props X, store X
// 오직 목업 데이터만 사용
const MOCK_POST: MatchPost = {
  type: "long",
  title: "마트 장봐주실 분 구해요",
  reward: 15000,
  location: "서울시 강남구 역삼동",

  // 하루도움 데이터 채워둠
  date: new Date(),
  startTime: new Date(new Date().setHours(10, 0)),
  endTime: new Date(new Date().setHours(12, 0)),
};
const typeLabelMap = {
  day: "하루도움",
  long: "지속도움",
} as const;

const MatchFormModal = ({ isOpen, setIsOpen }: MatchProps) => {
  const [editedPost, setEditedPost] = useState<MatchPost>(MOCK_POST);

  const updateField = <K extends keyof MatchPost>(
    key: K,
    value: MatchPost[K]
  ) => {
    setEditedPost((prev) => ({
      ...prev,
      [key]: value,
    }));
  };
  const navigate = useNavigate();

  // 서버로 보낼 때 사용할 헬퍼 함수
  const getPostForServer = () => {
    // TODO: 서버 전송 데이터 포맷팅
    return editedPost;
  };

  if (!isOpen) return null;

  return (
    <>
      {/* === 공통 필드 === */}
      <ModalBackground onClick={() => setIsOpen(false)}>
        <ModalCard onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>매칭 확인서</ModalTitle>
            <CloseButton
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            >
              ✕
            </CloseButton>
          </ModalHeader>

          <FieldSet>
            <ModalInput
              value={typeLabelMap[editedPost.type]}
              $editable={false}
              disabled
            />
          </FieldSet>

          <FieldSet>
            <ModalLabel>제목</ModalLabel>
            <ModalInput value={editedPost.title} $editable={false} disabled />
          </FieldSet>
          {/* === 하루도움 필드 === */}
          {editedPost.type === "day" ? (
            <DayHelpForm editedPost={editedPost} updateField={updateField} />
          ) : (
            <LongHelpForm editedPost={editedPost} updateField={updateField} />
          )}
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
                게시글에는 행정동만 표시되니 안심하세요.
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
          <BaseLongButton
            label="확인"
            onClick={() => {
              // 서버로 보낼 데이터 준비
              const postData = getPostForServer();
              console.log("서버로 보낼 데이터:", postData);
              // TODO: API 호출
              navigate("/chat");
            }}
          />
        </ModalCard>
      </ModalBackground>
    </>
  );
};

export default MatchFormModal;

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
  margin-bottom: 2rem;
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
