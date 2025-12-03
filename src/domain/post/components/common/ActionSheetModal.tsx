// src/components/common/ActionSheetModal.tsx

import React from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { IoWarningOutline } from "react-icons/io5";
import { RiShieldUserLine } from "react-icons/ri";
import { BsPencil } from "react-icons/bs";
import { IoTrashOutline } from "react-icons/io5";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// 게시물 상세 보기 내
const ActionSheetModal = ({ isOpen, onClose }: Props) => {
  return (
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
                  <IconWrapper>
                    <IoWarningOutline size={18} />
                  </IconWrapper>
                  <span>신고하기</span>
                </Item>

                <Divider />

                <Item>
                  <IconWrapper>
                    <RiShieldUserLine size={18} />
                  </IconWrapper>
                  <span>이 사용자의 글 보지 않기</span>
                </Item>

                <Divider />

                <Item>
                  <IconWrapper>
                    <BsPencil size={18} color="#4D7CFF" />
                  </IconWrapper>
                  <BlueText>수정하기</BlueText>
                </Item>

                <Divider />

                <Item>
                  <IconWrapper>
                    <IoTrashOutline size={18} color="#FF3B30" />
                  </IconWrapper>
                  <RedText>삭제하기</RedText>
                </Item>
              </MenuList>

              <CloseButton onClick={onClose}>닫기</CloseButton>
            </Panel>
          </Sheet>
        </>
      )}
    </AnimatePresence>
  );
};

export default ActionSheetModal;

/* ---------------- styled-components ---------------- */

const Dim = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: #000;
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
  background: #f5f5f5;
  border-radius: 16px;
  overflow: hidden;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 18px;
  font-size: 15px;
  cursor: pointer;
`;

const IconWrapper = styled.div`
  width: 24px;
  display: flex;
  justify-content: center;
  margin-right: 10px;
`;

const Divider = styled.div`
  height: 1px;
  background: #e5e5e5;
  margin-left: 18px;
`;

const BlueText = styled.span`
  color: #4d7cff;
  font-weight: 500;
`;

const RedText = styled.span`
  color: var(--error-red);
  font-weight: 500;
`;

const CloseButton = styled.button`
  width: 100%;
  margin-top: 10px;

  padding: 14px 0;
  background: var(--natural-100);
  border-radius: 12px;

  font-size: 16px;
  color: #a1a1a1;
  border: none;
  cursor: pointer;
`;
