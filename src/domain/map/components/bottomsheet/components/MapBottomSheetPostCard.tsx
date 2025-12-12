import React from "react";
import styled from "styled-components";
import type { Post } from "../../../../../store/useMapPostStore";
import HelpTag from "../../../../../components/HelpTag";
import { FaDroplet } from "react-icons/fa6";
interface Props {
  post: Post;
}

const MapBottomSheetPostCard = ({ post }: Props) => {
  return (
    <Card>
      <Content>
        <Row>
          <Title>{post.name}</Title>

          <Honey>
            <IconWrapper>
              <FaDroplet />
            </IconWrapper>
            <span>{post.honey}</span>
          </Honey>
        </Row>
        <Row>
          <Gender>{post.gender} ·&nbsp;&nbsp;</Gender>
          <Age>{post.age}</Age>
        </Row>
        <TagWrapper>
          {post.tags.map((tag) => (
            <HelpTag key={tag}>{tag}</HelpTag>
          ))}
        </TagWrapper>
      </Content>
    </Card>
  );
};
export default MapBottomSheetPostCard;
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
