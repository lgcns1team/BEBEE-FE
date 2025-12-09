/* 장소 검색 input 컴포넌트
- 마이페이지 수정 (주소), 게시글 작성, 매칭확인서(만남 장소)*/

import { IoIosSearch } from "react-icons/io";
import BaseInput from "./BaseInput";
import {
  SearchIconWrapper,
  LocationInputWrapper,
  InputBox,
} from "../styles/inputStyles";

interface LocationInputProps {
  inputLabel?: string;
  infoText?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
}
const LocationInput = ({
  inputLabel,
  infoText,
  ...rest
}: LocationInputProps) => {
  return (
    <BaseInput label={inputLabel} infoText={infoText} {...rest}>
      <LocationInputWrapper>
        <SearchIconWrapper>
          <IoIosSearch size={20} />
        </SearchIconWrapper>
        <InputBox placeholder="예: 서울특별시 강남구 역삼동" {...rest} />
      </LocationInputWrapper>
    </BaseInput>
  );
};

export default LocationInput;
