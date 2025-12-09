import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { IoCameraOutline } from "react-icons/io5";

import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import GeneralInput from "../../../components/GeneralInput";
import BaseLongButton from "../../../components/BaseLongButton";
import Badge from "../../../components/Badge";
import DayHelpWrite from "../components/write/DayHelpWrite";
import LongHelpWrite from "../components/write/LongHelpWrite";
import dayHelpImg from "../../../assets/images/day-help.png";
import longHelpImg from "../../../assets/images/long-help.png";
import { usePostStore } from "../../../store/usePostStore";
import { HELP_TAGS } from "../../../constants/helpTags";

type HelpType = "day" | "long";

const PostWritePage = () => {
  const navigate = useNavigate();
  const { type } = useParams<{ type?: string }>();
  const isDetailPage = type === "day" || type === "long";
  const [helpType, setHelpType] = useState<HelpType>(
    (type === "day" || type === "long" ? type : "day") as HelpType
  );
  const { postData, setPostData } = usePostStore();

  // 기본 정보 입력 페이지용 state
  const [title, setTitle] = useState(postData.title || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    postData.tags || []
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    postData.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 선택 핸들러
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 업로드 버튼 클릭
  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  // 태그 선택/해제
  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 다음 버튼 클릭
  const handleNext = () => {
    // postData에 기본 정보 저장
    setPostData({
      ...postData,
      title,
      tags: selectedTags,
      image: imagePreview || undefined,
    });

    // 선택된 타입에 따라 페이지 이동
    if (helpType === "day") {
      navigate("/post/write/day");
    } else {
      navigate("/post/write/long");
    }
  };

  if (isDetailPage) {
    return (
      <Layout>
        <Header
          title={helpType === "day" ? "하루 도움 작성" : "지속 도움 작성"}
          onBack={() => navigate("/post/write")}
        />
        <Container>
          <FormContainer>
            <FormWrapper $show={helpType === "day"} key="day">
              <DayHelpWrite />
            </FormWrapper>
            <FormWrapper $show={helpType === "long"} key="long">
              <LongHelpWrite />
            </FormWrapper>
          </FormContainer>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header title="게시글 작성" onBack={() => navigate("/")} />
      <Container>
        {/* 헬프타입 선택 */}
        <FieldSet>
          <ModalLabel>어떤 도움이 필요하세요 ?</ModalLabel>
          <HelpTypeContainer>
            <HelpTypeButton
              $selected={helpType === "day"}
              onClick={() => setHelpType("day")}
            >
              <HelpTypeContent>
                <ImgWrapper src={dayHelpImg} alt="하루 도움" />

                <HelpTypeInfo>
                  <HelpTypeTitle>하루 도움</HelpTypeTitle>
                  <HelpTypeExample>
                    예) 11월 7일 이동 보조, 당일 도움, 급구
                  </HelpTypeExample>
                </HelpTypeInfo>
              </HelpTypeContent>
              <RadioButton $selected={helpType === "day"} />
            </HelpTypeButton>

            <HelpTypeButton
              $selected={helpType === "long"}
              onClick={() => setHelpType("long")}
            >
              <HelpTypeContent>
                <ImgWrapper src={longHelpImg} alt="지속 도움" />
                <HelpTypeInfo>
                  <HelpTypeTitle>지속 도움</HelpTypeTitle>
                  <HelpTypeExample>
                    예) 매주 화요일, 수요일 병원 동행
                  </HelpTypeExample>
                </HelpTypeInfo>
              </HelpTypeContent>
              <RadioButton $selected={helpType === "long"} />
            </HelpTypeButton>
          </HelpTypeContainer>
        </FieldSet>

        {/* 사진 업로드 */}
        <FieldSet>
          <ModalLabel>사진</ModalLabel>
          <HelpTypeExample>
            픽드랍 장소, 요청 물품 등의 사진은 도우미의 수행에 도움이 돼요.
          </HelpTypeExample>
          <ImageUploadWrapper>
            <ImageUploadButton type="button" onClick={handleImageClick}>
              {imagePreview ? (
                <ImagePreview src={imagePreview} alt="미리보기" />
              ) : (
                <ImagePlaceholder>
                  <IoCameraOutline size={24} />
                  <ImagePlaceholderText>사진 추가</ImagePlaceholderText>
                </ImagePlaceholder>
              )}
            </ImageUploadButton>
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* HelpTag 선택 */}
        <FieldSet>
          <ModalLabel>도움 유형</ModalLabel>
          <Row>
            {HELP_TAGS.map((tag) => (
              <Badge
                key={tag}
                $active={selectedTags.includes(tag)}
                onClick={() => handleTagClick(tag)}
              >
                {tag}
              </Badge>
            ))}
          </Row>
        </FieldSet>

        {/* 다음 버튼 */}
        <BaseLongButton
          label="다음"
          onClick={handleNext}
          disabled={!title || selectedTags.length === 0}
        />
      </Container>
    </Layout>
  );
};

export default PostWritePage;

// Styled-components
const Container = styled.div`
  width: 100%;
`;

const FieldSet = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const ModalLabel = styled.label`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
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

const ImageUploadButton = styled.button`
  width: 100%;
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  overflow: hidden;
  padding: 0;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.color.subText2};
  background-color: ${({ theme }) => theme.color.natural50};
`;

const ImagePlaceholderText = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
`;

const HiddenInput = styled.input`
  display: none;
`;

const FormContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
`;

const FormWrapper = styled.div<{ $show: boolean }>`
  position: ${({ $show }) => ($show ? "relative" : "absolute")};
  top: 0;
  left: 0;
  width: 100%;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: ${({ $show }) => ($show ? "translateY(0)" : "translateY(-10px)")};
  pointer-events: ${({ $show }) => ($show ? "auto" : "none")};
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: ${({ $show }) => ($show ? 1 : 0)};
`;
const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
`;
