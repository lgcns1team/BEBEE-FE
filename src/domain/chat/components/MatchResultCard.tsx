// import styled from "styled-components";
// import chatLight from "../../../assets/images/chat-light.png";
// import MatchFailCard from "./MatchFailCard";
// import MatchSuccessCard from "./MatchSuccessCard";

// const MatchResultCard = ([addMessage]) => {
//   return (
//     <Card>
//       <Content>
//         <Header>
//           <img src={chatLight} alt="chat icon" width={60} height={60} />
//           <Title>매칭 확인서가 도착했어요</Title>
//           <Sub>아래의 정보를 확인해주세요.</Sub>
//         </Header>

//         <Info>
//           <div>유형: 지속도움</div>
//           <div>기간: 2025.03.11 ~ 2025.11.11</div>
//           <div>
//             일시:
//             <Indent> 화요일 11시-14시</Indent>
//             <Indent> 수요일 12시-14시</Indent>
//           </div>
//           <div>장소: 한남더힐주차장</div>
//           <div>꿀: 150꿀 /회(총 1200꿀)</div>
//           <div>카테고리: 방문목욕</div>
//         </Info>
//       </Content>
//       <ButtonWrapper>
//         <RefusalButton onClick={addMessage}>거절</RefusalButton>

//         <AcceptButton onClick={addMessage}>수락</AcceptButton>
//       </ButtonWrapper>
//     </Card>
//   );
// };

// export default MatchResultCard;

// const Card = styled.div`
//   width: 70%;
//   max-width: 330px;
//   display: flex;
//   flex-direction: column;
//   gap: 16px;
//   /*세로선*/
//   border-left: 3px solid ${({ theme }) => theme.color.main};
//   padding-left: 24px; /* 내용이 선에 붙지 않도록 */
// `;

// const Content = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: column;
// `;

// const Header = styled.div`
//   display: flex;
//   align-items: flex-start;
//   justify-content: flex-start;
//   flex-direction: column;
//   gap: 10px;
//   margin-bottom: 2rem;
// `;

// const Title = styled.div`
//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.bold};
//   color: ${({ theme }) => theme.color.main};
// `;

// const Sub = styled.div`
//   font-size: ${({ theme }) => theme.size.md};
//   color: ${({ theme }) => theme.color.subText2};
// `;

// const Info = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: flex-start;
//   gap: 12px;
//   font-size: ${({ theme }) => theme.size.md};
//   color: ${({ theme }) => theme.color.text};
//   line-height: 20px;
// `;

// const Indent = styled.div`
//   margin-left: 40px;
// `;
// const ButtonWrapper = styled.div`
//   width: 100%;
//   margin-top: 1rem;
//   display: flex;
//   gap: 12px;
// `;

// const AcceptButton = styled.button`
//   flex: 1;
//   color: ${({ theme }) => theme.color.white};
//   background-color: ${({ theme }) => theme.color.main};
//   padding: 12px 24px;
//   border: none;
//   border-radius: ${({ theme }) => theme.borderRadius.sm};
//   font-size: ${({ theme }) => theme.size.md};
//   cursor: pointer;
// `;

// const RefusalButton = styled.button`
//   flex: 1;
//   color: ${({ theme }) => theme.color.subText3};
//   background-color: ${({ theme }) => theme.color.natural100};
//   padding: 12px 24px;
//   border: none;
//   border-radius: ${({ theme }) => theme.borderRadius.sm};
//   font-size: ${({ theme }) => theme.size.md};
//   cursor: pointer;
// `;
