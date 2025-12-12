import styled from "styled-components";

const MapBottomSheetButton = styled.div`
  padding: 6px 12px;
  font-size: ${({ theme }) => theme.size.sm};
  background-color: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.text};
  border: 0.5px solid ${({ theme }) => theme.color.subText3};
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export default MapBottomSheetButton;
