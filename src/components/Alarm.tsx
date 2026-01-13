import styled from "styled-components";
import alarmLogo from "../assets/images/alarm-logo.png";
import { GoBell } from "react-icons/go";
const Alarm = () => {
  return (
    <Container>
      <ImaBox>
        <AlarmImage src={alarmLogo} alt="알림 로고" />
      </ImaBox>
      <Bell>
        <GoBell />
      </Bell>
    </Container>
  );
};

export default Alarm;
const Container = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
`;
const ImaBox = styled.div`
  width: 40px;
`;
const AlarmImage = styled.img`
  width: 35px;
`;

const Bell = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
`;
