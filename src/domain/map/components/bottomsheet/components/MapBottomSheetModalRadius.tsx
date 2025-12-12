import React from "react";
import styled from "styled-components";

interface Props {
  onApply: () => void;
  onClose: () => void;
}

const MapBottomSheetModalRadius = ({ onApply, onClose }: Props) => {
  return (
    <Panel onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ContentBox>
          <Title>어느 반경까지 찾고 계신가요 ?</Title>
          <SubTitle>최대 5km까지 1km 단위로 조정할 수 있어요.</SubTitle>

          <Info>
            내 위치 반경 <span>1km</span>의 도우미
          </Info>

          <SliderWrapper>
            <Track>
              <Filled />
            </Track>

            <LabelRow>
              <Label>1km</Label>
              <Label>5km</Label>
            </LabelRow>
          </SliderWrapper>
        </ContentBox>

        <ApplyButton onClick={onApply}>적용하기</ApplyButton>
      </ModalContainer>
    </Panel>
  );
};

export default MapBottomSheetModalRadius;

const Panel = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 0 16px 20px;

  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentBox = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 22px 20px 28px;
`;

const Title = styled.div`
  font-size: ${({ theme }) => theme.size.lg};

  margin-bottom: 4px;
`;

const SubTitle = styled.div`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
  margin-bottom: 24px;
`;

const Info = styled.div`
  text-align: center;
  background-color: ${({ theme }) => theme.color.natural50};
  border-radius: ${({ theme }) => theme.borderRadius.xsm};
  padding: 10px 0;
  font-size: ${({ theme }) => theme.size.md};
  margin-bottom: 24px;
  span {
    color: ${({ theme }) => theme.color.main};
  }
`;

const SliderWrapper = styled.div`
  margin: 0 auto;
  width: 100%;
`;

const Track = styled.div`
  position: relative;
  width: 100%;
  height: 8px;
  background: ${({ theme }) => theme.color.natural50};
  border-radius: 10px;
  overflow: hidden;
`;

const Filled = styled.div`
  width: 40%;
  height: 100%;
  background: ${({ theme }) => theme.color.main};
`;

const LabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
`;

const Label = styled.span`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText3};
`;

const ApplyButton = styled.button`
  width: 100%;
  height: 48px;
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-top: 12px;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.subText3};
  border: none;
`;
