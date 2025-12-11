import { create } from "zustand";

// 1. 메시지 데이터의 타입을 정의합니다.
interface Message {
  id: number;
  senderId: number;
  textContent: string;
  createdAt: string;
  messageType?: string; // 나중에 필요할 수 있어서 넣어둠 (선택사항)
}

// 2. 스토어 전체의 타입을 정의합니다.
interface ChatStore {
  messages: Message[];
  addMessage: (newMessage: Message) => void;
}

// 3. 목 데이터 (타입에 맞춰서 작성)
const MOCK_DATA: Message[] = [
  {
    id: 1,
    senderId: 2,
    textContent: "안녕하세요! 당근마켓 보고 연락드려요.",
    createdAt: "2023-10-27T10:00:00.000Z",
  },
  {
    id: 2,
    senderId: 1,
    textContent: "네 안녕하세요~ 어떤 제품 보셨나요?",
    createdAt: "2023-10-27T10:01:00.000Z",
  },
  {
    id: 3,
    senderId: 2,
    textContent: "맥북 프로 M1 모델이요! 네고 가능한가요?",
    createdAt: "2023-10-27T10:02:00.000Z",
  },
  {
    id: 4,
    senderId: 1,
    textContent: "아 죄송하지만 네고는 어렵습니다 ㅠㅠ",
    createdAt: "2023-10-27T10:05:00.000Z",
  },
];

// 4. 스토어 생성 (create 뒤에 <ChatStore> 타입을 붙여줍니다)
export const useMockChatStore = create<ChatStore>((set) => ({
  messages: MOCK_DATA,

  addMessage: (newMessage) =>
    set((state) => ({
      messages: [...state.messages, newMessage],
    })),
}));
