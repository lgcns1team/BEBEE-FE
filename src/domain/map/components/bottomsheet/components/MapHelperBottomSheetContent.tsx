import React from "react";
import MapHelperBottomSheetPostCard from "./MapHelperBottomSheetPostCard";
// import { useMapHelperPostStore } from "../../../../../store/useMapHelperPostStore";
import { usePostStore } from "../../../../../store/usePostStore";
const MapHelperBottomSheetContent = () => {
  const { posts } = usePostStore();

  return (
    <>
      {posts.map((post) => (
        <MapHelperBottomSheetPostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default MapHelperBottomSheetContent;
