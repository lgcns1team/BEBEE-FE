import React from "react";
import styled from "styled-components";
import type { HelperProfile } from "../../../../../store/useUserStore";
import type { Post } from "../../../../../store/usePostStore";
import HelpTag from "../../../../../components/HelpTag";
import { FaDroplet } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
interface Props {
  post?: Post;
  profile: HelperProfile;
}

const MapDisabledBottomSheetPostCard = ({ profile, post }: Props) => {
  const navigate = useNavigate();
  const goProfileInfo = (profileId: number) => {
    navigate(`/profile/helper/${profileId}`);
  };
  return (
    <Card onClick={() => goProfileInfo(profile.memberId)}>
      <Content>
        <Row>
          <Title>{profile?.name}</Title>

          <Honey>
            <IconWrapper>
              <FaDroplet />
            </IconWrapper>
            <span>{post?.totalHoney}</span>
          </Honey>
        </Row>
        <Row>
          <Gender>{profile?.gender} ·&nbsp;&nbsp;</Gender>
          <Age>{profile?.age}</Age>
        </Row>
        <TagWrapper>
          {post?.categoryName.map((category) => (
            <HelpTag key={category}>{category}</HelpTag>
          ))}
        </TagWrapper>
      </Content>
    </Card>
  );
};
export default MapDisabledBottomSheetPostCard;
const Card = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-top: 4px;
  padding-bottom: 16px;
  border-bottom: 0.5px solid ${({ theme }) => theme.color.natural100};
  background: ${({ theme }) => theme.color.white};
  margin-bottom: 18px;
  padding-left: 16px;
  padding-right: 16px;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  margin-right: 10px;
  line-height: 1.3;
`;
const Row = styled.div`
  display: flex;
`;

const Gender = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
`;

const Age = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
`;

const Honey = styled.div`
  span {
    font-weight: ${({ theme }) => theme.weight.medium};
  }
`;
const IconWrapper = styled.span`
  color: ${({ theme }) => theme.color.main};
  margin-right: 5px;
`;

const TagWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;
