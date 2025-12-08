import React from "react";
import { useTabStore } from "../../../../store/useTabStore";
import styled from "styled-components";
import Badge from "../../../../components/Badge";

const TABS = ["전체", "하루 도움", "지속 도움"] as const;

const Category = () => {
  const { activeTab, setActiveTab } = useTabStore();

  return (
    <Wrapper>
      {TABS.map((tab) => (
        <Badge
          key={tab}
          $active={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </Badge>
      ))}
    </Wrapper>
  );
};

/* 스타일 */
const Wrapper = styled.div`
  display: flex;
  gap: 8px;
  margin: 32px 0;
`;

export default Category;
