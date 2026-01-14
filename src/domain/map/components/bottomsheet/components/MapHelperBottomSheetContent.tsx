import MapHelperBottomSheetPostCard from "./MapHelperBottomSheetPostCard";
import { useMapStore } from "../../../store/useMapStore";

const MapHelperBottomSheetContent = () => {
  const posts = useMapStore((s) => s.posts);

  return (
    <>
      {posts.map((post) => (
        <MapHelperBottomSheetPostCard key={post.postId} post={post} />
      ))}
    </>
  );
};

export default MapHelperBottomSheetContent;