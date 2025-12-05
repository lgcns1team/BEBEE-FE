import React from "react";
import { useTabStore } from "../../../../store/useTabStore";
import { useMatchPostStore } from "../../../../store/useMatchPostStore";
import styled from "styled-components";

const TABS = ["전체", "하루 도움", "지속 도움"] as const;

const Category = () => {
  const { activeTab, setActiveTab } = useTabStore();
  const posts = useMatchPostStore((s) => s.posts);

  const filteredPosts =
    activeTab === "전체"
      ? posts
      : posts.filter((p) => p.category === activeTab);

  return (
    <Wrapper>
      {TABS.map((tab) => (
        <TabButton
          key={tab}
          $active={activeTab === tab}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </TabButton>
      ))}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  gap: 8px;
  margin: 0 auto;
  margin-top: 16px;
`;

// const TabArea = styled.div`
//
//
//   margin-bottom: 16px;
// `;

const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 4px 0px;
  border-radius: 20px;
  font-size: 12px;
  border: 0.5px solid ${({ $active }) => ($active ? "#FFB800" : "#E5E5E5")};
  background: ${({ $active }) => ($active ? "#FFF4D0" : "#F5F5F5")};
  color: ${({ $active }) => ($active ? "#FFB800" : "#737373")};
  font-weight: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  width: 60px;
  margin-right: 12px;
`;

export default Category;
