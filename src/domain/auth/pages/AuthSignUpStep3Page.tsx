import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import GeneralInput from "../../../components/GeneralInput";
//import LocationInput from "../../../components/LocationInput";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
import AuthGenderSelector from "../components/AuthGenderSelector";
import { FieldSet, ModalLabel, RequiredMark } from "../../../styles/FieldSetStyle";

import BaseInput from "../../../components/BaseInput";
import type { Gender } from "../auth.types";
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";
import { checkNickname } from "../../../api/authApi";
import LocationInput from "../../../components/LocationInput";

const AuthSignUpStep3Page = () => {
  const navigate = useNavigate();
  const { role, setPersonalInfo } = useAuthSignUpForm();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<Gender>("NONE");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);

  const handleNext = async () => {
    if (nickname.length > 10) {
      alert("닉네임은 10자 이내로 입력해주세요.");
      return;
    }

    // 중복 체크 API 호출
    try {
      const isDuplicated = await checkNickname(nickname);
      if (isDuplicated) {
        alert("이미 사용 중인 닉네임입니다.");
        return;
      }
    } catch (error) {
      console.error("닉네임 중복 체크 실패:", error);
    }

    // Zustand store에 저장
    setPersonalInfo({
      name,
      nickname,
      birthDate,
      gender,
      phoneNumber,
      addressRoad: address,
      latitude,
      longitude,
      districtCode,
    });
    navigate("/signup/step4");
  };

  const isFormValid = true; //name && nickname && birthDate && phoneNumber && address;

  // role이 없으면 이전 단계로 리다이렉트
  useEffect(() => {
    if (!role) {
      navigate("/signup/step1");
    }
  }, [role, navigate]);

  if (!role) {
    return null;
  }

  return (
    <Layout>
      <AuthSignUpHeader currentStep={3} totalSteps={6} onBack={() => navigate("/signup/step2")} />
      <PageContainer>
        <ScrollArea>
          <GeneralInput
            inputLabel="이름"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <GeneralInput
            inputLabel="닉네임"
            placeholder="ex. 비비"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />

          {/* 생년월일 - 네이티브 date picker 사용 */}
          <BaseInput label="생년월일" required>
            <DateInput
              type="date"
              value={birthDate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBirthDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]} // 오늘 날짜까지만 선택 가능
            />
          </BaseInput>

          <FieldSet>
            <ModalLabel>
              성별<RequiredMark>*</RequiredMark>
            </ModalLabel>
            <AuthGenderSelector value={gender} onChange={setGender} />
          </FieldSet>

          <GeneralInput
            type="tel"
            inputLabel="전화번호"
            placeholder="'-' 없이 숫자만 입력"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
          {/* 장소 api 연동했으므로 LocationInput 확인 후 코드 수정 요망 */}
          <LocationInput
            inputLabel="주소"
            value={address}
            onSelect={(loc) => {
              setAddress(loc.address); // 입력창에 표시될 값
              setDistrictCode(loc.code); // (현재는 address_name 들어올 수 있음)
              setLatitude(loc.lat);
              setLongitude(loc.lng);
            }}
            required
          />
        </ScrollArea>
      </PageContainer>
      <BaseLongButton label="다음" onClick={handleNext} disabled={!isFormValid} />
      <div style={{ height: "1rem" }} />
    </Layout>
  );
};

export default AuthSignUpStep3Page;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  padding: 2rem 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const DateInput = styled.input`
  width: 100%;
  height: 54px;  /* 다른 InputBox와 동일한 높이 */
  min-height: 54px;
  font-size: ${({ theme }) => theme.size.md};
  padding: 1rem;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.main};
  }

  /* 날짜 선택 전 placeholder 스타일 */
  &::-webkit-datetime-edit-text,
  &::-webkit-datetime-edit-month-field,
  &::-webkit-datetime-edit-day-field,
  &::-webkit-datetime-edit-year-field {
    color: ${({ theme }) => theme.color.subText2};
  }

  &::-webkit-calendar-picker-indicator {
    cursor: pointer;
  }
`;
