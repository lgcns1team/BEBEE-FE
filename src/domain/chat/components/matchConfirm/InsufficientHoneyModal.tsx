import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import honey from "../../../../assets/images/honey.png";
interface Props {
  isOpen: boolean;
  currentHoney: number;
  requiredHoney: number;
  onClose: () => void;
}

const InsufficientHoneyModal = ({
  isOpen,
  currentHoney,
  requiredHoney,
  onClose,
}: Props) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleRecharge = () => {
    onClose();
    navigate("/charge");
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay>
          <Dim
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <Modal
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <TextWrapper>
              <Title>앗! 꿀이 부족해요</Title>
              <AvailableHoney>사용 가능한 꿀: {currentHoney}꿀</AvailableHoney>
            </TextWrapper>
            <RequiredHoneyWrapper>
              <RequiredHoneyBox>
                <RequiredLabel>필요한 꿀</RequiredLabel>
                <RequiredAmount>{requiredHoney}꿀</RequiredAmount>
              </RequiredHoneyBox>
            </RequiredHoneyWrapper>
            <RechargeButton onClick={handleRecharge}>
              <HoneyIcon src={honey} alt={"꿀"}></HoneyIcon>꿀 충전하기
            </RechargeButton>

            <CancelButton onClick={onClose}>취소</CancelButton>
          </Modal>
        </ModalOverlay>
      )}
    </AnimatePresence>
  );

  // Portal을 사용하여 body에 직접 렌더링
  return createPortal(modalContent, document.body);
};

export default InsufficientHoneyModal;

/* ---------------- styled-components ---------------- */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dim = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
`;

const Modal = styled(motion.div)`
  position: relative;
  width: calc(100% - 32px);
  max-width: 400px;
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TextWrapper = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
`;
const Title = styled.h2`
  font-size: ${({ theme }) => theme.size.lg};
  font-weight: ${({ theme }) => theme.weight.bold};
  color: ${({ theme }) => theme.color.text};
  text-align: center;
  margin: 0;
`;

const AvailableHoney = styled.p`
  font-size: ${({ theme }) => theme.size.sm};
  color: ${({ theme }) => theme.color.subText2};
  text-align: center;
  margin: 0;
`;
const RequiredHoneyWrapper = styled.div`
  padding: 0 24px;
`;
const RequiredHoneyBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border: 1px solid #ffe082;
  background: ${({ theme }) => theme.color.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`;

const RequiredLabel = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
`;

const RequiredAmount = styled.span`
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.text};
  font-weight: ${({ theme }) => theme.weight.medium};
`;

const RechargeButton = styled.button`
  width: 100%;
  padding: 12px;
  background: ${({ theme }) => theme.color.main};
  border: none;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  color: ${({ theme }) => theme.color.white};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s;

  &:active {
    background: #ffb300;
  }
`;

const HoneyIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 12px;
  background: transparent;
  border: none;
  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText3};
  cursor: pointer;
  margin-top: 4px;

  &:active {
    opacity: 0.7;
  }
`;
