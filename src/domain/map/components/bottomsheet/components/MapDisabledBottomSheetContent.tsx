import MapBottomSheetPostCard from "./MapDisabledBottomSheetPostCard";

import { useMapStore } from "../../../store/useMapStore";

const MapDisabledBottomSheetContent = () => {
  const helpers = useMapStore((state) => state.helpers)
  return (
    <>
      {helpers.map((helper) => (
        <MapBottomSheetPostCard
          key={helper.id}
          helper={helper}
        />
      ))}
    </>
  );
};

// export default MapDisabledBottomSheetContent;
