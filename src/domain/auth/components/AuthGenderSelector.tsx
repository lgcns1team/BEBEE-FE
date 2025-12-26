import styled from "styled-components";
import type { Gender } from "../auth.types";

interface AuthGenderSelectorProps {
    value: Gender;
    onChange: (gender: Gender) => void;
}

const AuthGenderSelector = ({ value, onChange }: AuthGenderSelectorProps) => {
    const genders: { value: Gender; label: string }[] = [
        { value: "MALE", label: "남성" },
        { value: "FEMALE", label: "여성" },
        { value: "NONE", label: "선택안함" },
    ];

    return (
        <Container>
            {genders.map((gender) => (
                <GenderButton
                    key={gender.value}
                    type="button"
                    $selected={value === gender.value}
                    onClick={() => onChange(gender.value)}
                >
                    {gender.label}
                </GenderButton>
            ))}
        </Container>
    );
};

export default AuthGenderSelector;

const Container = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const GenderButton = styled.button<{ $selected: boolean }>`
  flex: 1;
  padding: 1rem;
  border: 0.5px solid
    ${({ $selected, theme }) =>
        $selected ? theme.color.main : theme.color.subText3};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ $selected, theme }) =>
        $selected ? theme.color.subColor2 : theme.color.white};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.main};
  }
`;
