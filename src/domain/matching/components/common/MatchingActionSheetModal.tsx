// src/components/common/ActionSheetModal.tsx

import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ActionSheetModal = ({ isOpen, onClose }: Props) => {
  if (!isOpen) return null;
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <Dim
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />

            <Sheet
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Panel>
                <MenuList>
                  <Item>
                    <span>매칭 취소하기</span>
                  </Item>

                  <Divider />

                  <Item>
                    <span>신고하기</span>
                  </Item>

                  <Divider />
                </MenuList>

                <CloseButton onClick={onClose}>닫기</CloseButton>
              </Panel>
            </Sheet>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ActionSheetModal;

/* ---------------- styled-components ---------------- */

const Dim = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => theme.color.text};
  z-index: 900;
`;

const Sheet = styled(motion.div)`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;

  max-width: 430px;
  margin: 0 auto;
  z-index: 999;

  display: flex;
  justify-content: center;
`;

const Panel = styled.div`
  width: 100%;
  padding: 0 16px 20px;
`;

const MenuList = styled.div`
  background: ${({ theme }) => theme.color.natural100};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  font-size: ${({ theme }) => theme.size.md};
  cursor: pointer;
`;

const Divider = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.color.natural200};
  margin-left: 18px;
`;

const CloseButton = styled.button`
  width: 100%;
  margin-top: 10px;

  padding: 14px 0;
  background: ${({ theme }) => theme.color.natural100};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  font-size: ${({ theme }) => theme.size.md};
  color: ${({ theme }) => theme.color.subText3};
  border: none;
  cursor: pointer;
`;
