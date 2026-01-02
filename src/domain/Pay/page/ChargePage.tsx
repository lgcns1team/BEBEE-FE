import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Layout from "../../../components/Layout";
import Header from "../../../components/Header";
const ChargePage = () => {
  const [amount, setAmount] = useState<string>("");
  const navigate = useNavigate();
  const handleQuickAmount = (value: number) => {
    const currentAmount = amount === "" ? 0 : parseInt(amount);
    const newAmount = currentAmount + value;
    setAmount(newAmount.toString());
  };

  const handleNumberClick = (num: string) => {
    if (num === "00") {
      setAmount((prev) => prev + "00");
    } else {
      setAmount((prev) => prev + num);
    }
  };

  const handleDelete = () => {
    setAmount((prev) => prev.slice(0, -1));
  };

  const getDisplayAmount = () => {
    if (amount === "") return "0";
    return parseInt(amount).toLocaleString();
  };

  const getPrice = () => {
    if (amount === "") return "0";
    return (parseInt(amount) * 100).toLocaleString();
  };

  return (
    <Layout>
      <Header onBack={() => navigate(-1)} title="꿀 충전" />

      <Content>
        <MainTitle>꿀 충전</MainTitle>
        <PayBox>
          {amount === "" ? (
            <PlaceholderText>얼마나 충전할까요 ?</PlaceholderText>
          ) : (
            <AmountDisplay>
              <HoneyAmount>{getDisplayAmount()}꿀</HoneyAmount>
              <PriceAmount>{getPrice()}원</PriceAmount>
            </AmountDisplay>
          )}
        </PayBox>
        <QuickAmountButtons>
          <QuickButton onClick={() => handleQuickAmount(100)}>
            + 100꿀
          </QuickButton>
          <QuickButton onClick={() => handleQuickAmount(200)}>
            + 200꿀
          </QuickButton>
          <QuickButton onClick={() => handleQuickAmount(500)}>
            + 500꿀
          </QuickButton>
          <QuickButton onClick={() => handleQuickAmount(1000)}>
            + 1000꿀
          </QuickButton>
        </QuickAmountButtons>

        <Numpad>
          <NumpadRow>
            <NumpadButton onClick={() => handleNumberClick("1")}>
              1
            </NumpadButton>
            <NumpadButton onClick={() => handleNumberClick("2")}>
              2
            </NumpadButton>
            <NumpadButton onClick={() => handleNumberClick("3")}>
              3
            </NumpadButton>
          </NumpadRow>
          <NumpadRow>
            <NumpadButton onClick={() => handleNumberClick("4")}>
              4
            </NumpadButton>
            <NumpadButton onClick={() => handleNumberClick("5")}>
              5
            </NumpadButton>
            <NumpadButton onClick={() => handleNumberClick("6")}>
              6
            </NumpadButton>
          </NumpadRow>
          <NumpadRow>
            <NumpadButton onClick={() => handleNumberClick("7")}>
              7
            </NumpadButton>
            <NumpadButton onClick={() => handleNumberClick("8")}>
              8
            </NumpadButton>
            <NumpadButton onClick={() => handleNumberClick("9")}>
              9
            </NumpadButton>
          </NumpadRow>
          <NumpadRow>
            <NumpadButton onClick={() => handleNumberClick("00")}>
              00
            </NumpadButton>
            <NumpadButton onClick={() => handleNumberClick("0")}>
              0
            </NumpadButton>
            <NumpadButton onClick={handleDelete}>←</NumpadButton>
          </NumpadRow>
        </Numpad>
      </Content>

      <ConfirmButton disabled={amount === ""}>확인</ConfirmButton>
    </Layout>
  );
};

export default ChargePage;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px 24px 24px;
`;

const MainTitle = styled.h2`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.color.text};
  text-align: center;
  margin: 0 0 40px;
`;

const PlaceholderText = styled.p`
  font-size: ${({ theme }) => theme.size.lg};
  color: ${({ theme }) => theme.color.subText3};
  text-align: center;
  margin: 0 0 60px;
`;

const AmountDisplay = styled.div`
  text-align: center;
  margin: 0 0 60px;
`;

const HoneyAmount = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: 700;
  color: ${({ theme }) => theme.color.text};
  margin-bottom: 8px;
`;

const PriceAmount = styled.div`
  font-size: ${({ theme }) => theme.size.lg};
  color: ${({ theme }) => theme.color.text};
`;

const PayBox = styled.div`
  width: 100%;
  height: 100px;
`;
const QuickAmountButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin-bottom: 40px;
`;

const QuickButton = styled.button`
  padding: 6px 8px;
  background-color: ${({ theme }) => theme.color.natural100};
  border: 1px solid ${({ theme }) => theme.color.natural100};
  border-radius: 20px;
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    background-color: #e0e0e0;
  }
`;

const Numpad = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`;

const NumpadRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
`;

const NumpadButton = styled.button`
  padding: 24px;
  background-color: ${({ theme }) => theme.color.white};
  border: none;
  border-radius: 8px;
  font-size: ${({ theme }) => theme.size.lg};
  color: ${({ theme }) => theme.color.text};
  cursor: pointer;
  transition: background-color 0.2s;

  &:active {
    background-color: #eeeeee;
  }
`;

const ConfirmButton = styled.button<{ disabled: boolean }>`
  width: 100%;
  padding: 14px 0;
  background-color: ${({ disabled, theme }) =>
    disabled ? theme.color.natural100 : theme.color.main};
  color: ${({ disabled, theme }) =>
    disabled ? theme.color.subText3 : theme.color.white};
  border: 1px solid
    ${({ disabled, theme }) =>
      disabled ? theme.color.natural100 : theme.color.main};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.size.md};
  font-weight: 600;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  transition: background-color 0.2s;

  &:not(:disabled):hover {
    background-color: #ffb300;
  }

  &:not(:disabled):active {
    background-color: #ffa000;
  }
`;
