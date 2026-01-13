// import { useState } from "react";
// import styled from "styled-components";

// import { AnimatePresence, motion } from "framer-motion";
// import useMapBottomSheet from "../hooks/useMapBottomSheet";
// import MapBottomSheetHeader from "./MapBottomSheetHeader";
// import MapBottomSheetContent from "./MapDisabledBottomSheetContent";
// import MapBottomSheetButton from "./MapBottomSheetButton";

// import { BiCurrentLocation } from "react-icons/bi";
// import { SlArrowRight } from "react-icons/sl";
// import MapBottomSheetModalLocation from "./MapBottomSheetModalLocation";
// import MapBottomSheetModalRadius from "./MapBottomSheetModalRadius";

import Speaker from "../../../../../assets/images/speaker.png";
import { IoMapOutline } from "react-icons/io5";
import List from "../../../../../assets/images/list.svg";
import { useUserStore } from "../../../../../store/useUserStore";

interface Props {
  onClickCurrentLocation: () => void;
  onClickHomeLocation: () => void;
  addressRoad: string;
  locationLabel: string;
  radius: number;
  onChangeRadius: (r: number) => void;
}

function MapDisabledBottomSheet({
  onClickCurrentLocation,
  locationLabel,
  radius,
  onChangeRadius,
  onClickHomeLocation,
  
}: Props) {
  const { sheet, content, snap, updateSnap, sheetY } = useMapBottomSheet();
  const [openModalLoacation, setOpenModalLocation] = useState(false);
  const [openModalRadius, setOpenModalRadius] = useState(false);
  const {user} = useUserStore();
  const handleGoMap = () => {
    updateSnap("HALF");
  };
  const handleGoList = () => {
    updateSnap("HALF");
  };

  return (
    <>
      {openModalLoacation && (
        <MapBottomSheetModalLocation
          onClose={() => setOpenModalLocation(false)}
          onClickCurrentLocation={onClickCurrentLocation}
          onClickHomeLocation={onClickHomeLocation}
          addressRoad = {user.addressRoad}
        />
      )}

//       {openModalRadius && (
//         <MapBottomSheetModalRadius
//           onClose={() => setOpenModalRadius(false)}
//           onApply={(nextRadius) => {
//             onChangeRadius(nextRadius);
//             setOpenModalRadius(false);
//           }}
//           role="USER"
//         />
//       )}

//       {(snap === "HALF" || snap === "MIN") && (
//         <CurrentLocation
//           onClick={onClickCurrentLocation}
//           style={{
//             top: sheetY !== null ? `${sheetY - 60}px` : `calc(100vh - 460px)`,
//           }}
//         >
//           <BiCurrentLocation size={20} />
//         </CurrentLocation>
//       )}

//       <Wrapper ref={sheet}>
//         <MapBottomSheetHeader />
//         <FixedArea>
//           <Button>
//             <MapBottomSheetButton onClick={() => setOpenModalLocation(true)}>
//               <BiCurrentLocation size={12} />
//               {locationLabel}
//             </MapBottomSheetButton>

//             <MapBottomSheetButton onClick={() => setOpenModalRadius(true)}>
//               반경 {radius}km
//             </MapBottomSheetButton>
//           </Button>
//         </FixedArea>

//         <InfoBar>
//           <InfoLeft>
//             <SpeakerImage src={Speaker} />
//             <span>게시글을 올려 도우미를 만나보세요</span>
//           </InfoLeft>
//           <SlArrowRight />
//         </InfoBar>

//         <ScrollArea ref={content}>
//           <MapBottomSheetContent />
//         </ScrollArea>

//         <AnimatePresence>
//           {snap === "FULL" && (
//             <GoMapButton
//               onClick={handleGoMap}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 20 }}
//               transition={{ duration: 0.25 }}
//             >
//               <GoMap>
//                 <IoMapOutline size={20} />
//                 지도보기
//               </GoMap>
//             </GoMapButton>
//           )}
//         </AnimatePresence>
//       </Wrapper>

//       <AnimatePresence>
//         {snap === "MIN" && (
//           <GoListButton
//             onClick={handleGoList}
//             style={{ bottom: "140px" }}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 20 }}
//             transition={{ duration: 0.25 }}
//           >
//             <GoList>
//               <ListImage src={List} />
//               목록보기
//             </GoList>
//           </GoListButton>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }

// export default MapDisabledBottomSheet;

const Wrapper = styled(motion.div)`
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 375px;
  left: 0;
  right: 0;
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

// const CurrentLocation = styled.div`
//   pointer-events: auto;
//   position: sticky;
//   left: 10%;
//   transform: translateX(-50%);
//   width: 35px;
//   height: 35px;
//   background: ${({ theme }) => theme.color.white};
//   border-radius: 50%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 300;
// `;

// const Button = styled.div`
//   text-align: center;
//   align-items: center;
//   display: flex;
//   gap: 10px;
// `;

// const FixedArea = styled.div`
//   background: ${({ theme }) => theme.color.white};
//   z-index: 10;
//   padding: 12px 16px 0;
//   flex-shrink: 0;
// `;

// const ScrollArea = styled.div`
//   flex: 1;
//   overflow-y: auto;
//   padding: 0 0 50vh;
// `;

// const SpeakerImage = styled.img`
//   width: 30px;
//   height: 30px;
// `;

// const InfoBar = styled.div`
//   margin: 12px 0;
//   background: #74d4ff;
//   height: 40px;
//   color: ${({ theme }) => theme.color.white};
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   padding: 0 12px;
//   z-index: 10;
//   flex-shrink: 0;
//   span {
//     font-size: ${({ theme }) => theme.size.md};
//   }
// `;

// const InfoLeft = styled.div`
//   display: flex;
//   align-items: center;
// `;

// const GoMapButton = styled(motion.button)`
//   pointer-events: auto;
//   position: absolute;
//   bottom: 100px;
//   left: 30%;
//   transform: translateX(-50%);
//   width: 120px;
//   height: 42px;
//   background: #364153;
//   color: ${({ theme }) => theme.color.white};
//   border-radius: 20px;

//   display: flex;
//   justify-content: center;
//   align-items: center;

//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.medium};

//   z-index: 500;
// `;

// const GoMap = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 6px;
// `;

// const GoListButton = styled(motion.button)`
//   pointer-events: auto;
//   position: absolute;
//   bottom: 100px;
//   left: 35%;
//   transform: translateX(-50%);
//   width: 120px;
//   height: 42px;
//   background: ${({ theme }) => theme.color.white};
//   color: ${({ theme }) => theme.color.text};
//   border-radius: 20px;

//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border: none;
//   font-size: ${({ theme }) => theme.size.md};
//   font-weight: ${({ theme }) => theme.weight.medium};

//   z-index: 500;
// `;

// const GoList = styled.div`
//   display: flex;
//   align-items: center;
//   gap: 6px;
// `;

const ListImage = styled.img`
  width: 15px;
  height: 15px;
`;

