import MapBottomSheetPostCard from "./MapDisabledBottomSheetPostCard";
import { useProfileStore } from "../../../../../store/useProfileStore";
import { usePostStore } from "../../../../../store/usePostStore";
const MapDisabledBottomSheetContent = () => {
  const helperProfiles = useProfileStore((state) => state.helperProfiles);
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
