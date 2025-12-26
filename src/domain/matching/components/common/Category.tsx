import styled from "styled-components";
import Badge from "../../../../components/Badge";

export type TabType = "전체" | "하루 도움" | "지속 도움";
const TABS = ["전체", "하루 도움", "지속 도움"] as const;

interface Props {
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

const Category = ({ activeTab, onChange }: Props) => {
  return (
    <Wrapper>
      {TABS.map((tab) => (
        <Badge
          key={tab}
          $active={activeTab === tab}
          onClick={() => onChange(tab)}
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
