import React from "react";
import DayHelpInfo from "./DayHelpInfo";
import LongHelpInfo from "./LongHelpInfo";
import type { Post } from "../../../../store/usePostStore";

interface Props {
  post: Post;
}

const MatchingInfo = ({ post }: Props) => {
  if (!post) return null;

  return (
    <>
      {post.category === "하루 도움" ? (
        <DayHelpInfo post={post} />
      ) : (
        <LongHelpInfo post={post} />
      )}
    </>
  );
};

export default MatchingInfo;
