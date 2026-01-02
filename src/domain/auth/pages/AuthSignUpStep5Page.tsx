import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoDocumentTextOutline } from "react-icons/io5";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import AuthSignUpHeader from "../components/AuthSignUpHeader";
import {
  FieldSet,
  ModalLabel,
  RequiredMark,
} from "../../../styles/FieldSetStyle";
import { useAuthSignUpForm } from "../../../store/useAuthSignUpStore";
import authHelperImage from "../../../assets/images/auth-helper.png";
import authDisabledImage from "../../../assets/images/auth-disabled.png";

const AuthSignUpStep5Page = () => {
  const navigate = useNavigate();
  const { role, setUploadedFile } = useAuthSignUpForm();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      // 파일 선택 후 Step 6으로 이동
      navigate("/signup/step6");
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Layout>
      <AuthSignUpHeader
        currentStep={5}
        totalSteps={6}
        onBack={() => navigate("/signup/step4")}
      />
      <PageContainer>
        <ScrollArea>
          <FieldSet>
            <ModalLabel>
              {role === "HELPER"
                ? "교육 이수증 업로드"
                : "장애인 복지카드/등록증 업로드"}
              <RequiredMark>*</RequiredMark>
            </ModalLabel>
            <HelpText>
              {role === "HELPER"
                ? "장애인 활동지원사 교육 이수증을 업로드해주세요."
                : "장애인 복지카드 또는 장애인 등록증을 업로드해주세요."}
            </HelpText>

            {/* 역할별 이미지 표시 */}
            <RoleImageContainer>
              <RoleImage
                src={role === "HELPER" ? authHelperImage : authDisabledImage}
                alt={role === "HELPER" ? "도우미 이미지" : "장애인 이미지"}
              />
            </RoleImageContainer>

            {/* 파일 업로드 버튼 */}
            <FileUploadButton type="button" onClick={handleFileClick}>
              <IoDocumentTextOutline size={40} />
              <UploadText>파일 선택</UploadText>
              <UploadSubText>이미지 또는 PDF 파일을 업로드하세요</UploadSubText>
            </FileUploadButton>

            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileSelect}
            />
          </FieldSet>
        </ScrollArea>
      </PageContainer>
      <BaseLongButton label="다음" onClick={handleFileClick} disabled={false} />
    </Layout>
  );
};

export default AuthSignUpStep5Page;

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const RoleImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
`;

const RoleImage = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  object-fit: contain;
`;

const FileUploadButton = styled.button`
  width: 100%;
  padding: 3rem 2rem;
  border: 2px dashed ${({ theme }) => theme.color.subText3};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.color.natural50};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.color.subText2};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.color.main};
    background-color: ${({ theme }) => theme.color.subColor2};
  }
`;

const UploadText = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;

const UploadSubText = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const HiddenInput = styled.input`
  display: none;
`;

const HelpText = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  margin-bottom: 1rem;
`;
