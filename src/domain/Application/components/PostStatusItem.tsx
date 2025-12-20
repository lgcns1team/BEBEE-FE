import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { FiCalendar, FiMapPin } from "react-icons/fi";

// Card 데이터 타입
interface PostStatusItemProps {
  excludeDone?: boolean;
  id: number;
  title: string;
}
interface CardData {
  id: number;
  title: string;
  locate: string;
  date: string;
  supporters: number;
  share: number;
  deadline: string;
  completed: boolean;
  helpTags: string[];
}

const mockCardList: CardData[] = [
  {
    id: 1,
    title: "마라톤 보조 구합니다",
    locate: "장충동",
    date: "11월 30일 (화)",
    supporters: 12,
    share: 5,
    deadline: "D-3",
    completed: false,
    helpTags: ["외출 동행", "기타 지원"],
  },
  {
    id: 1,
    title: "제목이 생각이 안나요",
    locate: "장충동",
    date: "월요일, 수요일, 금요일",
    supporters: 12,
    share: 5,
    deadline: "D-3",
    completed: true,
    helpTags: ["외출 동행", "기타 지원"],
  },
  {
    id: 2,
    title: "으아악",
    locate: "장충동",
    date: "월요일, 금요일",
    supporters: 12,
    share: 5,
    deadline: "D-3",
    completed: false,
    helpTags: ["외출 동행", "기타 지원"],
  },
  {
    id: 4,
    title: "마라톤 보조 구합니다",
    locate: "장충동",
    date: "3월 3일 (금)",
    supporters: 12,
    share: 5,
    deadline: "D-3",
    completed: true,
    helpTags: ["외출 동행", "기타 지원"],
  },
];

const PostStatusItem = ({ excludeDone }: PostStatusItemProps) => {
  const navigate = useNavigate();
  const filteredItems = excludeDone
    ? mockCardList.filter((item) => !item.completed)
    : mockCardList;

  // 클릭 시 해당 아이템의 id와 title을 인자로 받음
  const goToApplicant = (id: number, title: string) => {
    navigate(`/applicant/${id}`, {
      state: {
        headerTitle: title, // 전달받은 title을 state로 넘김
      },
    });
  };
  return (
    <Container>
      {/* 카드 */}
      {filteredItems.map((item) => (
        <Card key={item.id} onClick={() => goToApplicant(item.id, item.title)}>
          <TagRow>
            <StatusBadge completed={item.completed}>
              <CheckIcon completed={item.completed} />
              <span>{item.completed ? "매칭 완료" : "진행 중"}</span>
            </StatusBadge>

            <HelpTag>
              <SubTag>{item.helpTags[0]}</SubTag>
              <SubTag>{item.helpTags[1]}</SubTag>
            </HelpTag>
          </TagRow>
          <div>
            <CardTitle>{item.title}</CardTitle>

            <InfoRow>
              <InfoItem>
                <FiMapPin />
                <span>{item.locate}</span>
              </InfoItem>
              <InfoItem>
                <FiCalendar />
                <span>{item.date}</span>
              </InfoItem>
            </InfoRow>
          </div>
          <BottomBox>
            <BottomItem>
              지원자 <em>{item.supporters}</em>
            </BottomItem>
            <Line />
            <BottomItem>
              나눔 <em>{item.share}</em>
            </BottomItem>
            <Line />{" "}
            <BottomItem>
              마감<em>{item.deadline}</em>
            </BottomItem>
          </BottomBox>
        </Card>
      ))}
    </Container>
  );
};

export default PostStatusItem;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  background-color: ${({ theme }) => theme.color.natural50};
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.color.white};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const TagRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;
const StatusBadge = styled.div<{ completed?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${({ completed, theme }) =>
    completed ? theme.color.natural100 : theme.color.subColor2};

  span {
    color: ${({ completed, theme }) =>
      completed ? theme.color.subText3 : theme.color.main};
  }
`;

const CheckIcon = styled(BsFillPatchCheckFill)<{ completed?: boolean }>`
  font-size: 16px;
  color: ${({ completed, theme }) =>
    completed ? theme.color.subText3 : theme.color.main};
`;

const HelpTag = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SubTag = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.color.natural200};
  color: ${({ theme }) => theme.color.subText2};
`;

const CardTitle = styled.h2`
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  gap: 14px;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  svg {
    font-size: 14px;
  }
`;

const BottomBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 13px;
`;

const BottomItem = styled.div`
  em {
    color: ${({ theme }) => theme.color.main};
    font-style: normal;
    margin-left: 4px;
  }
`;

const Line = styled.div`
  width: 1px;
  height: 14px;
  background: #eee;
`;
