import { useNavigate } from "react-router-dom";
import styled from "styled-components";

/* Components */
import Header from "../../../components/Header";
import Layout from "../../../components/Layout";
import NavBar from "../../../components/NavBar";

/*임시 이미지 API연동 시 제거*/
import mock1 from "@/assets/images/review-bee1.png";
import mock2 from "@/assets/images/review-bee2.png";
import mock3 from "@/assets/images/review-bee3.png";
import mock4 from "@/assets/images/review-bee4.png";

interface Chat {
  chatId: number;
  userName: string;
  userNickname: string;
  userImage: string;
  sweetness: number;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  postTitle: string;
  postDate: string;
  postCategory: string[];
  postType: "one-time" | "long-term";
  postHoney: number | "나눔";
  postLocation: string;
}

// 모의 데이터
const mockChats: Chat[] = [
  {
    chatId: 1,
    userName: "박위",
    userNickname: "냠냠쩝쩝",
    userImage: mock1,

    sweetness: 47.3,
    lastMessage: "너무 좋은데요 ? 꿀벌씨 짱 ~",
    timestamp: "오후 9:35",
    unreadCount: 0,
    postTitle: "마라톤 보조해주실 분 구합니다",
    postDate: "11월 30일 (화)",
    postCategory: ["생활 지원", "이동 지원"],
    postType: "one-time",
    postHoney: 30000,
    postLocation: "서울시 은평구 우성아파트",
  },
  {
    chatId: 2,
    userName: "김민지",
    userNickname: "미식탐정",
    userImage: mock2,
    sweetness: 48.5,
    lastMessage: "그 식당이 입구에 턱이 있어서 못 들어가요 ㅠㅠ",
    timestamp: "어제",
    unreadCount: 2,
    postTitle: "맛집 동행해주세요 제발",
    postDate: "11월 28일 (목)",
    postCategory: ["의료 동행"],
    postType: "one-time",
    postHoney: 25000,
    postLocation: "서울시 강남구 은평세브란스",
  },
  {
    chatId: 3,
    userName: "이준호",
    userNickname: "미식탐정",
    userImage: mock3,
    sweetness: 46.8,
    lastMessage: "그 식당이 입구에 턱이 있어서 못 들어가요 ㅠㅠ",
    timestamp: "12월 27일",
    unreadCount: 0,
    postTitle: "맛집 동행해주세요 제발",
    postDate: "매주 월,목",
    postCategory: ["이동 지원"],
    postType: "long-term",
    postHoney: 50000,
    postLocation: "서울시 송파구 잠실동",
  },
  {
    chatId: 4,
    userName: "최서연",
    userNickname: "미식탐정",
    userImage: mock4,
    sweetness: 49.2,
    lastMessage: "그 식당이 입구에 턱이 ",
    timestamp: "12월 27일",
    unreadCount: 0,
    postTitle: "맛집 동행해주세요 제발",
    postDate: "11월 29일 (수)",
    postCategory: ["의료 동행"],
    postType: "one-time",
    postHoney: "나눔",
    postLocation: "서울시 마포구 상암동",
  },
  {
    chatId: 5,
    userName: "박지민",
    userNickname: "미식탐정",
    userImage: mock3,
    sweetness: 47.1,
    lastMessage: "제가 할말이 만아효 할말이 왕 많아서 길이를 ..,",
    timestamp: "12월 27일",
    unreadCount: 0,
    postTitle: "맛집 동행해주세요 제발",
    postDate: "11월 29일 (수)",
    postCategory: ["의료 동행"],
    postType: "one-time",
    postHoney: "나눔",
    postLocation: "서울시 마포구 상암동",
  },
  {
    chatId: 6,
    userName: "박지민",
    userNickname: "미식탐정",
    userImage: mock4,
    sweetness: 47.1,
    lastMessage: "제가 할말이 만아효 할말이 왕 많아서 길이를 ..,",
    timestamp: "12월 27일",
    unreadCount: 0,
    postTitle: "맛집 동행해주세요 제발",
    postDate: "11월 29일 (수)",
    postCategory: ["의료 동행"],
    postType: "one-time",
    postHoney: "나눔",
    postLocation: "서울시 마포구 상암동",
  },
  {
    chatId: 7,
    userName: "박지민",
    userNickname: "미식탐정",
    userImage: mock3,
    sweetness: 47.1,
    lastMessage: "제가 할말이 만아효 할말이 왕 많아서 길이를 ..,",
    timestamp: "12월 27일",
    unreadCount: 0,
    postTitle: "맛집 동행해주세요 제발",
    postDate: "11월 29일 (수)",
    postCategory: ["의료 동행"],
    postType: "one-time",
    postHoney: "나눔",
    postLocation: "서울시 마포구 상암동",
  },
];

const ChatListPage = () => {
  const navigate = useNavigate();

  const handleClickChat = (chatId: number) => {
    navigate(`/chat/${chatId}`);
  };
  return (
    <ChatContainer>
      <Layout>
        <Header title="채팅" onBack={() => navigate("/")} />
        <ChatList>
          {mockChats.map((chat) => (
            <ChatItem
              key={chat.chatId}
              onClick={() => handleClickChat(chat.chatId)}
            >
              <ProfileImage src={chat.userImage} />
              <ChatInfo>
                <ChatFirstRow>
                  <Nickname>{chat.userNickname}</Nickname>
                  <ChatLastTime>{chat.timestamp}</ChatLastTime>
                </ChatFirstRow>
                <PostTitle>{chat.postTitle}</PostTitle>
                <ChatLastRow>
                  <LastMessage>{chat.lastMessage}</LastMessage>
                  {chat.unreadCount > 0 && (
                    <UnreadBadge>{chat.unreadCount}</UnreadBadge>
                  )}
                </ChatLastRow>
              </ChatInfo>
            </ChatItem>
          ))}
        </ChatList>
      </Layout>
      <NavBar />
    </ChatContainer>
  );
};

export default ChatListPage;

// Styled Components
const ChatContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
`;

const ChatList = styled.div`
  overflow-y: auto;
  height: calc(100vh - 73px);
`;

const ChatItem = styled.div`
  position: relative;
  height: 131px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  cursor: pointer;
  display: flex;
  align-items: flex-start;
  padding-top: 30px;
`;

const ProfileImage = styled.img`
  width: 15%;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const ChatInfo = styled.div`
  margin-left: 15px;
  flex: 1;
`;
const ChatFirstRow = styled.div`
  display: flex;
  align-items: flex-start;
`;
const Nickname = styled.p`
  font-weight: ${({ theme }) => theme.weight.medium};
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  margin: 0;
`;

const ChatLastTime = styled.p`
  position: absolute;
  right: 0px;
  font-weight: ${({ theme }) => theme.weight.regular};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;

const PostTitle = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  margin: 2px 0 0 0;
`;
const ChatLastRow = styled.div`
  display: flex;
  align-items: flex-end;
  margin-top: 8px;
`;
const LastMessage = styled.p`
  max-width: 80%;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UnreadBadge = styled.div`
  position: absolute;
  right: 0px;
  width: 19px;
  height: 19px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.main};
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.text};
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: ${({ theme }) => theme.weight.regular};
`;
