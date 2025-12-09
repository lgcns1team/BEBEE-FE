import React from "react";
import styled from "styled-components";
import DoneBadge from "../../../../components/DoneBadge";
import Bee from "../../../../assets/images/helptag-bee.png";

interface Props {
  title: string;
  honey: number;
  place: string;
  done: boolean;
}

const ProfileHelpPostCard = ({ title, honey, place, done }: Props) => {
  return (
    <Card>
      <HelpImage src={Bee} alt="image" />

      <Content>
        <Title>{title}</Title>

        <Row>
          {done && <Done>매칭 완료</Done>}
          <Honey>{honey}꿀</Honey>
        </Row>

        <Place>{place}</Place>
      </Content>
    </Card>
  );
};

export default ProfileHelpPostCard;

const Card = styled.div`
  width: 100%;
  display: flex;
  gap: 14px;
  flex-direction: column;
  align-items: center;

  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  cursor: pointer;
`;

const HelpImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  object-position: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: space-between;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  font-weight: ${({ theme }) => theme.weight.regular};
  color: ${({ theme }) => theme.color.text};
`;

const Row = styled.div`
  display: flex;
  gap: 0;
`;

const Done = styled(DoneBadge)`
  transform: scale(0.7);
  transform-origin: left center;
  margin-right: -8px;
`;

const Honey = styled.div`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.text};
`;

const Place = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
`;
