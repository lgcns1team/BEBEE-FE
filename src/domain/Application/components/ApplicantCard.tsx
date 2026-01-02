import React from "react";
import styled from "styled-components";
import { FaHeart } from "react-icons/fa";
import { TbDropletFilled } from "react-icons/tb";
import HelpTag from "../../../components/HelpTag";
interface PostItem {
  id: number;
  nickname: string;
  temperature: number;
  gender: string;
  ageGroup: string;
  location: string;
  isSharing: boolean;
  tags: string[];
}
// --- Components ---

const ApplicantList: React.FC<{ item: PostItem }> = ({ item }) => (
  <PostItemWrapper>
    <Card>
      <UserInfo>
        <div className="top-row">
          <span className="nickname">{item.nickname}</span>
          <span className="temp">
            <TbDropletFilled color="#FFB800" /> {item.temperature}
          </span>
        </div>
        <div className="sub-info">
          {item.gender} · {item.ageGroup} · {item.location}
        </div>
      </UserInfo>

      {item.isSharing && (
        <SharingBadge>
          나눔 <FaHeart size={14} color="#FFA2A2" />
        </SharingBadge>
      )}

      <TagList>
        {item.tags.map((tag) => (
          <HelpTag /*key={idx}*/>{tag}</HelpTag>
        ))}
      </TagList>
    </Card>
  </PostItemWrapper>
);

export default ApplicantList;

const PostItemWrapper = styled.div`
  position: relative;
`;
const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background-color: ${({ theme }) => theme.color.white};
`;
const UserInfo = styled.div`
  margin-bottom: 12px;
  background-color: ${({ theme }) => theme.color.white};
  .top-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;

    .nickname {
      font-size: ${({ theme }) => theme.size.md};
    }

    .temp {
      color: ${({ theme }) => theme.color.text};
      font-size: ${({ theme }) => theme.size.sm};
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }

  .sub-info {
    font-size: ${({ theme }) => theme.size.sm};
    color: ${({ theme }) => theme.color.subText3};
  }
`;

const SharingBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 16px;
  padding: 4px 10px;
  border: 1px solid ${({ theme }) => theme.color.red500};
  border-radius: 6px;
  background-color: ${({ theme }) => theme.color.red50};
  color: ${({ theme }) => theme.color.text};
  font-size: ${({ theme }) => theme.size.sm};
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TagList = styled.div`
  display: flex;
  gap: 8px;
`;
