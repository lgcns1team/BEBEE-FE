import React from "react";
import MapBottomSheetPostCard from "./MapUserBottomSheetPostCard";
import { useMapUserPostStore } from "../../../../../store/useMapUserPostStore";

const MapUserBottomSheetContent = () => {
  const { posts } = useMapUserPostStore();

  return (
    <>
      {posts.map((post) => (
        <MapBottomSheetPostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default MapUserBottomSheetContent;
