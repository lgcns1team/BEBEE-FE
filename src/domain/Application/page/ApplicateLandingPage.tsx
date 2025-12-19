import styeld from "styled-components";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";
import bee_letter from "../../../assets/images/bee-letter.png";
import BaseLongButton from "../../../components/BaseLongButton";

const infoList = [
  {
    num: 1,
    text: "도우미의 프로필 정보를 확인할 수 있어요",
  },
  {
    num: 2,
    text: "내가 선택한 도우미와 채팅이 가능해요",
  },
  {
    num: 3,
    text: "나눔을 신청한 도우미를 확인해요",
  },
];

const PointLandingPage = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <Header onBack={() => navigate(-1)} />
      <Wrapper>
        <HiConatiner>
          <span>반가워요 !</span>
          <span>
            <span style={{ color: "#FFBE00" }}>꿀벌</span>들이 당신을
          </span>
          <span>기다리고 있어요</span>
        </HiConatiner>
        <ImgContainer></ImgContainer>
        {/* 정보 리스트 */}
        <InformationList>
          {infoList.map((info) => (
            <InfoItem key={info.num}>
              <Number>{info.num}</Number>
              <Text>{info.text}</Text>
            </InfoItem>
          ))}
        </InformationList>
      </Wrapper>
      <BaseLongButton
        label="지원자 보러가기"
        onClick={() => navigate("/status")}
      />
    </Layout>
  );
};

export default PointLandingPage;

const Wrapper = styeld.div`
display: flex;
flex-direction: column;
gap: 40px;
`;

const HiConatiner = styeld.div`
    width: fit-content;
    display: flex;
    flex-direction: column;
    font-size: ${({ theme }) => theme.size.lg};
    color: ${({ theme }) => theme.color.text};
    font-weight: ${({ theme }) => theme.weight.bold};
    padding-top: 16px;

`;

const ImgContainer = styeld.div`
    width: 100%;
    height: 280px;
    background-image: url(${bee_letter});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
`;

const InformationList = styeld.ol`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    list-style: none;

    `;
const InfoItem = styeld.li`
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: 8px;
    font-size: ${({ theme }) => theme.size.md};
    
`;
const Number = styeld.span`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;   
    padding: 5px;
    border: 1px solid ${({ theme }) => theme.color.subColor2} ;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.color.subColor2} ;
    color: ${({ theme }) => theme.color.main} ;
`;
const Text = styeld.span`
    color: ${({ theme }) => theme.color.text} ;
`;
