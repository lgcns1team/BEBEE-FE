import styled from "styled-components";
import { IoChevronBack } from "react-icons/io5";

interface AuthSignUpHeaderProps {
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
}

const AuthSignUpHeader = ({
    currentStep,
    totalSteps,
    onBack,
}: AuthSignUpHeaderProps) => {
    return (
        <Container>
            <Left onClick={onBack}>
                <IoChevronBack size={25} />
            </Left>

            <ProgressText>
                {currentStep} / {totalSteps}
            </ProgressText>
        </Container>
    );
};

export default AuthSignUpHeader;

const Container = styled.header`
  width: 100%;
  height: 73px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
  z-index: 800;
`;

const Left = styled.div`
  height: 30px;
  width: 30px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.color.text};
`;

const ProgressText = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.main};
`;
