import { useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import BaseLongButton from "../../../components/BaseLongButton";
import applicationImg from "../../../assets/images/application.png";

const AuthSignUpCompletePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status"); // 'success' or 'pending'

    const handleGoLogin = () => {
        // 추후 개발될 로그인 페이지로 이동
        navigate("/login");
    };

    return (
        <Layout>
            <Container>
                <ContentArea>
                    <ImageWrapper>
                        <StyledImage src={applicationImg} alt="가입 완료" />
                    </ImageWrapper>

                    <Title>회원가입이 완료되었습니다!</Title>

                    <MessageWrapper>
                        {status === "success" ? (
                            <SubText>
                                서류 승인이 자동으로 완료되었습니다.<br />
                                지금 바로 비비의 서비스를 이용해보세요!
                            </SubText>
                        ) : (
                            <SubText>
                                서류가 정상적으로 접수되었습니다.<br />
                                관리자 검토(1~2일) 후 승인 완료 알림을 보내드릴게요.
                            </SubText>
                        )}
                    </MessageWrapper>
                </ContentArea>

                <BaseLongButton
                    label="로그인 화면으로 이동"
                    onClick={handleGoLogin}
                />
            </Container>
        </Layout>
    );
};

export default AuthSignUpCompletePage;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 0 1.25rem 2rem;
    height: 100%;
`;

const ContentArea = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
`;

const ImageWrapper = styled.div`
    width: 200px;
    height: 200px;
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const StyledImage = styled.img`
    width: 100%;
    height: auto;
    object-fit: contain;
`;

const Title = styled.h2`
    font-size: ${({ theme }) => theme.size.lg};
    font-weight: ${({ theme }) => theme.weight.bold};
    color: ${({ theme }) => theme.color.text};
    margin-bottom: 1rem;
`;

const MessageWrapper = styled.div`
    margin-bottom: 3rem;
`;

const SubText = styled.p`
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    word-break: keep-all;
`;
