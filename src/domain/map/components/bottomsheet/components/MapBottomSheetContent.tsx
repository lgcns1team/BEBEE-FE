import React from "react";
import MapBottomSheetPostCard from "./MapBottomSheetPostCard";
import { useMapPostStore } from "../../../../../store/useMapPostStore";

const MapBottomSheetContent = () => {
  const { posts } = useMapPostStore();

  return (
    <>
      {posts.map((post) => (
        <MapBottomSheetPostCard key={post.id} post={post} />
      ))}
    </>
  );
};

export default MapBottomSheetContent;
