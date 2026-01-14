/*공통 input 컴포넌트
- 매칭확인서, 게시글 작성, 로그인, 회원가입, 마이페이지 수정 사용*/
import BaseInput from "./BaseInput";
import { InputWrapper, InputBox } from "../styles/inputStyles";
interface InputProps {
  inputLabel?: string;
  infoText?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  required?: boolean;
  placeholder?: string;
}

const GeneralInput = ({ inputLabel, infoText, onClick, ...rest }: InputProps) => {
  return (
    <BaseInput label={inputLabel} infoText={infoText} {...rest}>
      {" "}
      <InputWrapper>
        {" "}
        <InputBox {...rest} onClick={onClick} />
      </InputWrapper>
    </BaseInput>
  );
};

export default GeneralInput;
