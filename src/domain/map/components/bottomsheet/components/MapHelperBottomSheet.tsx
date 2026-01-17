import { useState } from "react";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import useMapBottomSheet from "../hooks/useMapBottomSheet";
import MapBottomSheetHeader from "./MapBottomSheetHeader";
import MapHelperBottomSheetContent from "./MapHelperBottomSheetContent";
import MapBottomSheetButton from "./MapBottomSheetButton";

import { BiCurrentLocation } from "react-icons/bi";
import { SlArrowRight } from "react-icons/sl";
import MapBottomSheetModalLocation from "./MapBottomSheetModalLocation";
import MapBottomSheetModalRadius from "./MapBottomSheetModalRadius";

import Flower from "../../../../../assets/images/flower.svg";
import { IoMapOutline } from "react-icons/io5";
import { BsList } from "react-icons/bs";

interface Props {
  onClickCurrentLocation: () => void;
  onClickHomeLocation: () => void;
  locationLabel: string;
  radius: number;
  onChangeRadius: (r: number) => void;
  addressRoad: string;
}

function MapHelperBottomSheet({
  onClickCurrentLocation,
  onClickHomeLocation,
  addressRoad,
  locationLabel,
  radius,
  onChangeRadius,
}: Props) {
  const { sheet, content, snap, updateSnap, sheetY } = useMapBottomSheet();
  const [openModalLocation, setOpenModalLocation] = useState(false);
  const [openModalRadius, setOpenModalRadius] = useState(false);

  const handleGoMap = () => updateSnap("HALF");
  const handleGoList = () => updateSnap("HALF");

  return (
    <>
      {openModalLocation && (
        <MapBottomSheetModalLocation
          onClose={() => setOpenModalLocation(false)}
          onClickCurrentLocation={onClickCurrentLocation}
          onClickHomeLocation={onClickHomeLocation}
          addressRoad={addressRoad}
        />
      )}

      {openModalRadius && (
        <MapBottomSheetModalRadius
          onClose={() => setOpenModalRadius(false)}
          onApply={(nextRadius) => {
            onChangeRadius(nextRadius);
            setOpenModalRadius(false);
          }}
          role="HELPER"
        />
      )}

      {(snap === "HALF" || snap === "MIN") && (
        <CurrentLocation
          onClick={onClickCurrentLocation}
          style={{
            top: sheetY !== null ? `${sheetY - 60}px` : `calc(100vh - 460px)`,
          }}
        >
          <BiCurrentLocation size={20} />
        </CurrentLocation>
      )}

      <Wrapper ref={sheet}>
        <MapBottomSheetHeader />

        <FixedArea>
          <Button>
            <MapBottomSheetButton onClick={() => setOpenModalLocation(true)}>
              <BiCurrentLocation size={12} />
              {locationLabel}
            </MapBottomSheetButton>

            <MapBottomSheetButton onClick={() => setOpenModalRadius(true)}>
              반경 {radius}km
            </MapBottomSheetButton>
          </Button>
        </FixedArea>

        <InfoBar>
          <InfoLeft>
            <FlowerImage src={Flower} />
            <span>나의 주변 꽃잎들을 도울 수 있어요</span>
          </InfoLeft>
          <SlArrowRight />
        </InfoBar>

        <ScrollArea ref={content}>
          <MapHelperBottomSheetContent />
        </ScrollArea>

        <AnimatePresence>
          {snap === "FULL" && (
            <GoMapButton
              onClick={handleGoMap}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <GoMap>
                <IoMapOutline size={20} />
                지도보기
              </GoMap>
            </GoMapButton>
          )}
        </AnimatePresence>
      </Wrapper>

      <AnimatePresence>
        {snap === "MIN" && (
          <GoListButton
            onClick={handleGoList}
            style={{ bottom: "170px" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <GoList>
              <BsList size={20} />
              목록보기
            </GoList>
          </GoListButton>
        )}
      </AnimatePresence>
    </>
  );
}

export default MapHelperBottomSheet;

const Wrapper = styled(motion.div)`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  z-index: 100;
  border-top-left-radius: ${({ theme }) => theme.borderRadius.lg};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.color.white};
  height: 100vh;
  overflow: hidden;
  will-change: transform;
  cursor: grab;
`;

const CurrentLocation = styled.button`
  pointer-events: auto;
  position: sticky;
  width: 35px;
  height: 35px;
  margin-left: 16px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  border: none;
`;

const Button = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const FixedArea = styled.div`
  background: ${({ theme }) => theme.color.white};
  z-index: 10;
  padding: 0 16px 0;
  flex-shrink: 0;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 0 50vh;
`;

const FlowerImage = styled.img`
  width: 30px;
  height: 30px;
`;

const InfoBar = styled.div`
  margin: 12px 0;
  background: #ffa1ad;
  height: 40px;
  color: ${({ theme }) => theme.color.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  z-index: 10;
  flex-shrink: 0;
  span {
    font-size: ${({ theme }) => theme.size.md};
  }
`;

const InfoLeft = styled.div`
  display: flex;
  align-items: center;
`;

const GoMapButton = styled(motion.button)`
  position: absolute;
  bottom: 100px;
  left: 35%;
  transform: translateX(-50%);
  width: 120px;
  height: 42px;
  background: #364153;
  color: ${({ theme }) => theme.color.white};
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  z-index: 500;
`;

const GoMap = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const GoListButton = styled(motion.button)`
  pointer-events: auto;
  position: absolute;
  bottom: 100px;
  left: 35%;
  transform: translateX(-50%);
  width: 120px;
  height: 42px;
  background: ${({ theme }) => theme.color.white};
  color: ${({ theme }) => theme.color.text};
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  font-size: ${({ theme }) => theme.size.md};
  font-weight: ${({ theme }) => theme.weight.medium};
  z-index: 500;
`;

const GoList = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;
