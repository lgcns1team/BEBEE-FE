import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import BaseInput from "./BaseInput";
import {
  SearchIconWrapper,
  LocationInputWrapper,
  InputBox,
} from "../styles/inputStyles";
import styled from "styled-components";

interface LocationInputProps {
  inputLabel?: string;
  infoText?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelect: (loc: {
    address: string;
    code: string;
    lat: number;
    lng: number;
  }) => void;
  required?: boolean;
  placeholder?: string;
}

const LocationInput = ({
  inputLabel,
  infoText,
  value,
  onSelect,
  ...rest
}: LocationInputProps) => {
  const [keyword, setKeyword] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const [ps, setPs] = useState<any>(null);

  // 1. 카카오 장소 검색 객체 초기화
  useEffect(() => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      setPs(new window.kakao.maps.services.Places());
    }
  }, []);

  // 2. 키워드 검색 실행 함수
  const searchPlaces = (searchKeyword: string) => {
    if (!ps) return;
    if (!searchKeyword.trim()) {
      setResults([]);
      return;
    }

    ps.keywordSearch(searchKeyword, (data: any, status: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        setResults(data);
      } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
        setResults([]);
      }
    });
  };

  // 3. 입력창 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    searchPlaces(val); // 실시간 검색 (혹은 엔터키 이벤트로 분리 가능)
  };

  // 4. 장소 선택 핸들러
  const handleSelectPlace = (place: any) => {
    onSelect({
      address: place.place_name,
      code: place.address_name, // 법정동 코드는 추가 좌표-주소 변환 API 필요 (하단 설명 참고)
      lat: Number(place.y),
      lng: Number(place.x),
    });
    console.log(place);
    setKeyword(place.place_name); // 입력창에 선택된 주소 넣기
    setResults([]); // 리스트 닫기
  };

  return (
    <BaseInput label={inputLabel} infoText={infoText} {...rest}>
      <LocationInputWrapper style={{ position: "relative" }}>
        <SearchIconWrapper>
          <IoIosSearch size={20} />
        </SearchIconWrapper>
        <InputBox
          placeholder="예: 동아아파트 정문"
          value={keyword}
          onChange={handleInputChange}
          {...rest}
        />

        {/* 검색 결과 리스트 표시 */}
        {results.length > 0 && (
          <SearchResultList>
            {results.map((place, idx) => (
              <SearchResultItem
                key={idx}
                onClick={() => handleSelectPlace(place)}
              >
                <div className="place-name">{place.place_name}</div>
                <div className="address-name">{place.address_name}</div>
              </SearchResultItem>
            ))}
          </SearchResultList>
        )}
      </LocationInputWrapper>
    </BaseInput>
  );
};

export default LocationInput; // --- 스타일 추가 (예시) ---
const SearchResultList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: white;
  border: 1px solid #ddd;
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SearchResultItem = styled.li`
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  &:hover {
    background: #f9f9f9;
  }
  .place-name {
    font-weight: bold;
    font-size: 14px;
  }
  .address-name {
    font-size: 12px;
    color: #666;
  }
`;
// -----------------------
