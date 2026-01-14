import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IoClose } from "react-icons/io5";
import { IoIosCamera } from "react-icons/io";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import GeneralInput from "../../../components/GeneralInput";
import BaseLongButton from "../../../components/BaseLongButton";
import Badge from "../../../components/Badge";
import DayHelpWrite from "../components/write/DayHelpWrite";
import LongHelpWrite from "../components/write/LongHelpWrite";
import dayHelpImg from "../../../assets/images/day-help.png";
import longHelpImg from "../../../assets/images/long-help.png";
import { HELP_TAG_LIST } from "../../../constants/helpTags";
import type { PostCreateReqDTO } from "../../../types/post.type";
import {
  FieldSet,
  ModalLabel,
  RequiredMark,
} from "../../../styles/FieldSetStyle";
import { uploadFile } from "../../../api/fileApi2";
const PostWritePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ---------------- 1. 상태 객체화 (Tip A) ---------------- */
  const [isDetailPage, setIsDetailPage] = useState(false);
  const [formData, setFormData] = useState<Partial<PostCreateReqDTO>>({
    postType: undefined,
    title: "",
    helpCategoryIds: [],
    postImages: [],
    // 초기값 세팅 (필수 파람 에러 방지용)
    unitHoney: 0,
    totalHoney: 0,
    schedules: [],
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  /* ---------------- 2. 공통 업데이트 핸들러 ---------------- */
  // field 이름을 키로 사용하여 값을 업데이트하는 함수
  const updateField = (updates: Partial<PostCreateReqDTO>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleTagClick = (id: number) => {
    const currentIds = formData.helpCategoryIds || [];
    const newIds = currentIds.includes(id)
      ? currentIds.filter((t) => t !== id)
      : [...currentIds, id];
    updateField({ helpCategoryIds: newIds });
  };

  /* ---------------- 3. 상세 페이지 전환 ---------------- */
  const handleNext = () => {
    // 필수 항목 검증 (순차적으로 체크하여 명확한 메시지 제공)
    if (!formData.postType) {
      alert("어떤 도움이 필요한지 선택해주세요.");
      return;
    }
    if (!formData.title || formData.title.trim() === "") {
      alert("제목을 입력해주세요.");
      return;
    }
    if (!formData.helpCategoryIds || formData.helpCategoryIds.length === 0) {
      alert("도움 유형을 최소 하나 선택해주세요.");
      return;
    }
    if (!formData.content || formData.content.trim() === "") {
      alert("상세 내용을 입력해주세요.");
      return;
    }

    setIsDetailPage(true);
  };
  if (isDetailPage) {
    return (
      <Layout>
        <Header
          title={
            formData.postType === "DAY" ? "하루 도움 작성" : "지속 도움 작성"
          }
          onBack={() => setIsDetailPage(false)}
          showBack
        />
        <Container>
          {/* 자식에게 객체와 업데이트 함수만 전달 */}
          {formData.postType === "DAY" ? (
            <DayHelpWrite formData={formData} updateField={updateField} />
          ) : (
            <LongHelpWrite formData={formData} updateField={updateField} />
          )}
        </Container>
      </Layout>
    );
  }
  /* ---------------- 이미지 선택 핸들러 ---------------- */
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    // 최대 3장 제한 체크
    if (imagePreviews.length + fileArray.length > 3) {
      alert("사진은 최대 3장까지 업로드 가능합니다.");
      return;
    }

    // A. 미리보기 생성 (UI용)
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    // B. Presigned URL을 통한 S3 업로드
    try {
      const entityId = Date.now().toString();
      const uploadPromises = fileArray.map((file) =>
        uploadFile(file, "posts", entityId)
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      // C. formData 업데이트
      updateField({
        postImages: [...(formData.postImages || []), ...uploadedUrls],
      });
    } catch (error) {
      console.error("파일 업로드 실패:", error);
      alert("파일 업로드에 실패했습니다. 다시 시도해주세요.");
      // 업로드 실패 시 미리보기도 제거
      setImagePreviews((prev) => prev.slice(0, prev.length - fileArray.length));
    }

    // input 초기화 (같은 파일 다시 선택 가능하도록)
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ---------------- 이미지 삭제 핸들러 ---------------- */
  const handleImageRemove = (index: number) => {
    // 미리보기 삭제
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));

    // formData에서 실제 URL 삭제
    const newPostImages = formData.postImages?.filter((_, i) => i !== index);
    updateField({ postImages: newPostImages });
  };

  return (
    <ScrollWrapper>
      <Header title="게시글 작성" onBack={() => navigate("/home")} showBack />
      {/* 헬프타입 선택 */}

      <Container>
        <FieldSet>
          <ModalLabel>
            어떤 도움이 필요하세요 ?<RequiredMark>*</RequiredMark>
          </ModalLabel>
          <HelpTypeContainer>
            {(["DAY", "TERM"] as const).map((type) => (
              <HelpTypeButton
                key={type}
                $selected={formData.postType === type}
                onClick={() => updateField({ postType: type })}
              >
                <HelpTypeContent>
                  <ImgWrapper src={type === "DAY" ? dayHelpImg : longHelpImg} />
                  <HelpTypeInfo>
                    <HelpTypeTitle>
                      {type === "DAY" ? "하루 도움" : "지속 도움"}
                    </HelpTypeTitle>
                    <HelpTypeExample>
                      {type === "DAY"
                        ? "예) 11월 7일 이동 보조"
                        : "예) 매주 화요일 병원 동행"}
                    </HelpTypeExample>
                  </HelpTypeInfo>
                </HelpTypeContent>
                <RadioButton $selected={formData.postType === type} />
              </HelpTypeButton>
            ))}
          </HelpTypeContainer>
        </FieldSet>

        {/* 사진 업로드 */}
        <FieldSet>
          <ModalLabel>사진</ModalLabel>
          <HelpTypeExample>
            픽드랍 장소, 요청 물품 등의 사진은 도우미의 수행에 도움이 돼요.
          </HelpTypeExample>
          <ImageUploadWrapper>
            <ImageList>
              {imagePreviews.length < 3 && (
                <ImageUploadButton
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlaceholder>
                    <IoIosCamera size={30} />
                    <ImagePlaceholderText>
                      {imagePreviews.length}/3
                    </ImagePlaceholderText>
                  </ImagePlaceholder>
                </ImageUploadButton>
              )}
              {imagePreviews.map((preview, index) => (
                <ImageItem key={index}>
                  <ImagePreview src={preview} alt={`미리보기 ${index + 1}`} />
                  <DeleteButton onClick={() => handleImageRemove(index)}>
                    <IoClose size={14} />
                  </DeleteButton>
                </ImageItem>
              ))}
            </ImageList>
            <HiddenInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
            />
          </ImageUploadWrapper>
        </FieldSet>

        {/* 제목 입력 */}
        <GeneralInput
          inputLabel="제목"
          placeholder="제목을 입력해주세요"
          value={formData.title}
          onChange={(e) => updateField({ title: e.target.value })}
          required
        />

        {/* HelpTag 선택 */}
        <FieldSet>
          <ModalLabel>
            도움 유형<RequiredMark>*</RequiredMark>
          </ModalLabel>
          <Row>
            {HELP_TAG_LIST.map((tag) => (
              <Badge
                key={tag.id}
                $active={formData.helpCategoryIds?.includes(tag.id)}
                onClick={() => handleTagClick(tag.id)}
              >
                {tag.name}
              </Badge>
            ))}
          </Row>
        </FieldSet>
        {/* 상세 내용 */}
        <FieldSet>
          <ModalLabel>
            상세 내용<RequiredMark>*</RequiredMark>
          </ModalLabel>
          <TextArea
            placeholder="예시) 매주 화요일 오후 2시부터 4시까지 병원 동행이 필요합니다. 휠체어를 사용하고 있어 이동 보조가 필요해요."
            value={formData.content || ""}
            onChange={(e) => updateField({ content: e.target.value })}
          />
        </FieldSet>
        {/* 다음 버튼 */}
      </Container>
      <BaseLongButton
        label="다음"
        onClick={handleNext}
        disabled={
          !formData.postType ||
          !formData.title ||
          formData.title.trim() === "" ||
          !formData.helpCategoryIds ||
          formData.helpCategoryIds.length === 0 ||
          !formData.content ||
          formData.content.trim() === ""
        }
      />
    </ScrollWrapper>
  );
};

export default PostWritePage;

// Styled-components
const ScrollWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  display: flex;
  padding: 0 16px 16px 16px;
  background-color: ${({ theme }) => theme.color.white};
`;
const Container = styled.div`
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const HelpTypeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const HelpTypeButton = styled.button<{ $selected: boolean }>`
  width: 100%;
  padding: 1rem;
  border: 0.5px solid
    ${({ $selected, theme }) =>
      $selected ? theme.color.main : theme.color.subText3};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.color.subColor2 : theme.color.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
`;

const HelpTypeContent = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  flex: 1;
`;

const ImgWrapper = styled.img`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  flex-shrink: 0;
`;

const HelpTypeInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 0.25rem;
  flex: 1;
`;

const HelpTypeTitle = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;

const HelpTypeExample = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  font-weight: ${({ theme }) => theme.weight.regular};
`;

const RadioButton = styled.div<{ $selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 0.5px solid
    ${({ $selected, theme }) =>
      $selected ? theme.color.main : theme.color.subText3};
  background-color: ${({ $selected, theme }) =>
    $selected ? theme.color.main : theme.color.white};
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.white};
    display: ${({ $selected }) => ($selected ? "block" : "none")};
    transition: opacity 0.2s ease;
  }
`;

const ImageUploadWrapper = styled.div`
  width: 100%;
`;

const ImageList = styled.div`
  display: flex;
  height: 100px;

  align-items: center;
  gap: 12px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ImageItem = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 80px;
  height: 80px;
`;

const ImagePreview = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
`;

const DeleteButton = styled.button`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.text};
  color: ${({ theme }) => theme.color.white};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  z-index: 1;
`;

const ImageUploadButton = styled.button`
  width: 80px;
  height: 80px;
  border: 0.5px solid ${({ theme }) => theme.color.natural50};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  overflow: hidden;
  padding: 0;
  flex-shrink: 0;
`;

const ImagePlaceholder = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: ${({ theme }) => theme.color.subText2};
  background-color: ${({ theme }) => theme.color.natural50};
`;

const ImagePlaceholderText = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.color.subText2};
`;

const HiddenInput = styled.input`
  display: none;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 150px;
  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.color.subColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-family: inherit;
  font-size: ${({ theme }) => theme.size.md};
  resize: none;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.color.main};
  }
`;
