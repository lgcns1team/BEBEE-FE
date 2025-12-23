import React from "react";
import MapBottomSheetPostCard from "./MapUserBottomSheetPostCard";
import { useHelperProfileStore } from "../../../../../store/useHelperProfileStore";
import { usePostStore } from "../../../../../store/usePostStore";
const MapUserBottomSheetContent = () => {
  const profiles = useHelperProfileStore((state) => state.profiles);
  const posts = usePostStore((state) => state.posts);
  return (
    <>
      {profiles.map((profile, index) => (
        <MapBottomSheetPostCard
          key={profile.name + index}
          profile={profile}
          post={posts[index]}
        />
      ))}
    </>
  );
};

export default MapUserBottomSheetContent;
