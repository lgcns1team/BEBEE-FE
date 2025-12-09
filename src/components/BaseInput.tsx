/* input 스타일 통일 */

import {
  FieldSet,
  InputLabel,
  RequiredMark,
  InfoText,
} from "../styles/inputStyles";

interface BaseInputProps {
  label?: string;
  required?: boolean;
  infoText?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  children?: React.ReactNode;
}

const BaseInput = ({ label, required, infoText, children }: BaseInputProps) => {
  return (
    <FieldSet>
      {label && (
        <InputLabel>
          {label}
          {required && <RequiredMark>*</RequiredMark>}
          {infoText && <InfoText>{infoText}</InfoText>}
        </InputLabel>
      )}

      {children}
    </FieldSet>
  );
};

export default BaseInput;
