import React from "react";
import styled from "styled-components";
import { FiHome } from "react-icons/fi";
import { BiCurrentLocation } from "react-icons/bi";
import { useUserStore } from "../../../../../store/useUserStore";
interface Props {
  onClose: () => void;
/** 현재 위치 기준 */
  onClickCurrentLocation: () => void;
  /** 집 기준 */
  onClickHomeLocation: () => void;
  /** 회원가입 시 입력한 주소 */
  addressRoad : string

}

const MapBottomSheetModalLocation = ({
  onClose,
  onClickCurrentLocation,
  onClickHomeLocation,
  
}: Props) => {
  const {user} = useUserStore();
  return (
    <Overlay onClick={onClose}>
      <Wrapper onClick={(e) => e.stopPropagation()}>
        <Title>어디에서 찾고 계신가요?</Title>

        {/* 집 */}
        <Home
          onClick={() => {
            onClickHomeLocation();
            onClose();
          }}
        >
          <FiHome size={20} />
          <HomeRight>
            <MainName>집</MainName>
            <SubName>{user.addressRoad|| "주소 정보 없음"}</SubName>
          </HomeRight>
        </Home>

        {/* 현재 위치 */}
        <Current
          onClick={() => {
            onClickCurrentLocation();
            onClose();
          }}
        >
          <BiCurrentLocation size={22} />
          현재 위치
        </Current>
      </Wrapper>
    </Overlay>
  );
};

export default MapBottomSheetModalLocation;

const Overlay = styled.div`
  pointer-events: auto;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const Wrapper = styled.div`
  margin-bottom: 40px;
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 340px;
  padding: 20px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  margin-bottom: 16px;
`;

const Home = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  cursor: pointer;
`;

const HomeRight = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainName = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;

const SubName = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
`;

const Current = styled.div`
  padding: 12px 0;
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 10px;
`;