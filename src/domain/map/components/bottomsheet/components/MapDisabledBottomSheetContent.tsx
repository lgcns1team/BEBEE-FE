import React from "react";
import MapBottomSheetPostCard from "./MapDisabledBottomSheetPostCard";
import { useUserStore } from "../../../../../store/useUserStore";
import { usePostStore } from "../../../../../store/usePostStore";
const MapDisabledBottomSheetContent = () => {
  const helperProfiles = useUserStore((state) => state.helperProfiles);
  const posts = usePostStore((state) => state.posts);

  return (
    <>
      {helperProfiles.map((profile, index) => (
        <MapBottomSheetPostCard
          key={profile.memberId}
          profile={profile}
          post={posts[index]}
        />
      ))}
    </>
  );
};

export default MapDisabledBottomSheetContent;
