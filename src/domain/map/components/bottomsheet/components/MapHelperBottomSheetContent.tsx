import MapHelperBottomSheetPostCard from "./MapHelperBottomSheetPostCard";
import { useMapStore } from "../../../store/useMapStore";
const MapHelperBottomSheetContent = () => {
  const {posts} = useMapStore();

  return (
    <>
      {posts.map((post) => (
        <MapHelperBottomSheetPostCard key={post.postId} post={post} />
      ))}
    </>
  );
};

export default MapHelperBottomSheetContent;
