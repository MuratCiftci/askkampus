import { Skeleton } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import Comments from "~/components/app/Comments";
import CommunityBanner from "~/components/app/CommunityBanner";
import CommunityStatsCard from "~/components/app/CommunityStatsCard";
import PostCard from "~/components/app/PostCard";
import PostDetailCard from "~/components/app/PostDetailCard";
import { toast } from "~/components/hooks/ui/use-toast";
import { api } from "~/utils/api";

const Post = () => {
  const router = useRouter();

  const { id, community_id } = router.query as {
    id: string;
    community_id: string;
  };

  // fetch post by id

  const { data: post, isLoading } = api.post.getPostByIdAndCommunity.useQuery({
    id: id,
  });

  const { data: comments, isLoading: commentsLoading } =
    api.post.getComments.useQuery({
      postId: id,
    });

  //add comment

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  console.log(post, "post");

  return (
    <div className="w-full">
      <CommunityBanner community={post.community} />
      <div className="align-start mx-auto flex w-full flex-row justify-end">
        <div className="w-full">
          <PostDetailCard post={post} />
          {commentsLoading ? (
            <div className="mt-4"> Loading... </div>
          ) : (
            <Comments comments={comments} />
          )}
        </div>
        <CommunityStatsCard id={post.communityId} />
      </div>
    </div>
  );
};

export default Post;
