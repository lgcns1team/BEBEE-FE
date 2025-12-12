import React from "react";
import MapHelperBottomSheetPostCard from "./MapHelperBottomSheetPostCard";
import { useMapHelperPostStore } from "../../../../../store/useMapHelperPostStore";

const MapHelperBottomSheetContent = () => {
  const { posts } = useMapHelperPostStore();

  return (
    <>
      {posts.map((post) => (
        <MapHelperBottomSheetPostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default MapHelperBottomSheetContent;
