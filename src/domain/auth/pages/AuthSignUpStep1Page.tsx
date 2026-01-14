import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
import AuthRoleSelectButton from "../components/AuthRoleSelectButton";
import { FieldSet, ModalLabel } from "../../../styles/FieldSetStyle";
import type { UserRole } from "../auth.types";
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";

const AuthSignUpStep1Page = () => {
  const navigate = useNavigate();
  const { role, setRole } = useAuthSignUpForm();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(role);

  const handleNext = () => {
    if (!selectedRole) return;
    setRole(selectedRole); // Zustand store에 저장
    navigate("/signup/step2");
  };

  return (
    <Layout>
      <AuthSignUpHeader currentStep={1} totalSteps={5} onBack={() => navigate("/home")} />
      <PageContainer>
        <ScrollArea>
          <FieldSet>
            <ModalLabel>어떤 역할로 가입하시나요?</ModalLabel>
            <RoleButtonGroup>
              <AuthRoleSelectButton
                role="HELPER"
                label="도우미"
                selected={selectedRole === "HELPER"}
                onClick={() => setSelectedRole("HELPER")}
              />
              <AuthRoleSelectButton
                role="DISABLED"
                label="장애인"
                selected={selectedRole === "DISABLED"}
                onClick={() => setSelectedRole("DISABLED")}
              />
            </RoleButtonGroup>
          </FieldSet>
        </ScrollArea>
      </PageContainer>
      <BaseLongButton label="다음" onClick={handleNext} disabled={!selectedRole} />
    </Layout>
  );
};

export default AuthSignUpStep1Page;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding: 2rem 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const RoleButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;
