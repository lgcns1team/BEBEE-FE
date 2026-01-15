import styled from "styled-components";
import HelpTag from "../../../../../components/HelpTag";
import { useNavigate } from "react-router-dom";
import { HELP_TAG_MAP } from "../../../../../constants/helpTags";
import type { NearByHelperDto } from "../../../../../types/map.type";
interface Props {
  helper: NearByHelperDto
}

const MapDisabledBottomSheetPostCard = ({ helper }: Props) => {
  const navigate = useNavigate();
  const goProfileInfo = (id: string) => {
    navigate(`/profile/helper/${id}`);
  };
  if (!helper) return null;
  return (
    <Card onClick={() => goProfileInfo(helper.id)}>
      <Content>
        <Row>
          <Title>{helper.nickname}</Title>
        </Row>
        <Row>
          <Gender>{helper.gender === "MALE" ? "남성" : "여성"} ·&nbsp;&nbsp;</Gender>
          <Age>{helper.ageGroup}대</Age>
        </Row>
        <TagWrapper>
          {helper?.helpCategories.map((cat) => (
            <HelpTag key={cat}>{HELP_TAG_MAP[cat]}</HelpTag>
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

const TagWrapper = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 6px;
`;
