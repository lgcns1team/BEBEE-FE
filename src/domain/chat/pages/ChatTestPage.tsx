import styled from "styled-components";
import { chatApi } from "../api/chatApi";

const ChatTestContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
`;

const TestButton = styled.button`
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const ChatTestPage = () => {
  // 테스트용 내 ID (임시)
  const MY_ID = 100;

  // 1. 동네지도에서 클릭 시 (상대방 ID만 전송)
  const handleMapChat = async () => {
    console.log("동네지도 채팅 시도...");
    const result = await chatApi.openChatRoom(MY_ID, 200); // 상대방 201번
    console.log("결과:", result);
  };

  // 2. 도우미 지원 현황에서 클릭 시 (게시글 정보 포함)
  const handleSupportChat = async () => {
    console.log("도우미 지원 현황 채팅 시도...");
    const mockPostData = {
      postId: 555,
      postTitle: "임시 게시글: 장보기 도와주세요",
      helpCategoryIds: [1, 3], // 예: 1번 이동지원, 3번 생활지원
    };
    const result = await chatApi.openChatRoom(
      MY_ID,
      200,
      undefined,
      mockPostData
    );
    console.log("결과:", result);
  };

  // 3. 매칭 현황에서 클릭 시 (기존 채팅방 ID로 조회)
  const handleMatchingChat = async () => {
    console.log("기존 채팅방 조회 시도...");
    const EXISTING_ROOM_ID = "791458418405204700"; // 실제 존재하는 방 번호여야 함
    const result = await chatApi.openChatRoom(
      MY_ID,
      undefined,
      EXISTING_ROOM_ID
    );
    console.log("결과:", result);
  };

  return (
    <ChatTestContainer>
      <h3>서버 데이터 전송 테스트</h3>
      <TestButton onClick={handleMapChat}>
        1. 동네지도 테스트 (memberId 200)
      </TestButton>
      <TestButton onClick={handleSupportChat}>
        2. 지원현황 테스트 (게시글 정보 포함)
      </TestButton>
      <TestButton onClick={handleMatchingChat}>
        3. 매칭현황 테스트 (방번호 1번)
      </TestButton>
    </ChatTestContainer>
  );
};

export default ChatTestPage;
