import styled from "styled-components";
import { MdPeopleAlt } from "react-icons/md";
import { FaHeart } from "react-icons/fa";
// Card 데이터 타입
interface CardData {
  id: number;
  title: string;
  supporters: number;
  left: number;
}

const mockCardList: CardData[] = [
  {
    id: 1,
    title: "마라톤 보조 구합니다",
    supporters: 5,
    left: 0,
  },
  {
    id: 2,
    title: "반찬 주 1회 조리",
    supporters: 5,
    left: 2,
  },
  {
    id: 3,
    title: "4살 여아와 수화로 대화",
    supporters: 23,
    left: 0,
  },
];

const PostStatusItem = () => {
  return (
    <Container>
      {mockCardList.map((data) => (
        <CardWrapper key={data.id}>
          <CardTitle>{data.title}</CardTitle>

          <StatRow>
            <StatRowLabel>
              <MdPeopleAlt size={20} color="#8EC5FF" />
              지원자 수
            </StatRowLabel>
            <StatRowValue>{data.supporters}명</StatRowValue>
          </StatRow>

          <StatRow>
            <StatRowLabel>
              <FaHeart size={20} color="#FFA2A2" />
              나눔
            </StatRowLabel>
            <StatRowValue>{data.left}명</StatRowValue>
          </StatRow>
        </CardWrapper>
      ))}
    </Container>
  );
};

export default PostStatusItem;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

const CardWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 20px;
`;

const CardTitle = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 24px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatRowLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText2};
`;

const StatRowValue = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;
