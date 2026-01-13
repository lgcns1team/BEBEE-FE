import styled from "styled-components";

const ExperienceSection = () => {

  
  return (
    <ExperienceContainer>
      <Title>이런 경력이 있어요</Title>

      <ExperienceType>
        <ExperienceContent>활동 지원사 이수증</ExperienceContent>
        <ExperienceInfo>2024 취득</ExperienceInfo>
      </ExperienceType>

      <ExperienceDescription>
        <span>2024년 자격증 취득 이후 현재까지 꾸준한 활동을 이어오며, 실질적인 도움 제공 경험을 쌓아오고 있습니다.</span>
      </ExperienceDescription>
    </ExperienceContainer>
  );
};

export default ExperienceSection;

const ExperienceContainer = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  width: 100%;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.bold};
`;

const ExperienceType = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  background-color: ${({ theme }) => theme.color.subColor};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
`;

const ExperienceContent = styled.div`
  font-size: ${({ theme }) => theme.size.md};
`;

const ExperienceInfo = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const ExperienceDescription = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  border: 1px solid ${({ theme }) => theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 12px;
`;
