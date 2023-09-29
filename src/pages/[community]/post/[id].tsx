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

  const { id, community } = router.query as { id: string; community: string };

  // fetch post by id

  const { data: post, isLoading } = api.post.getPostByIdAndCommunity.useQuery({
    community_name: community,
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
        <CommunityStatsCard name={post.community.name} />
      </div>
    </div>
  );
};

export default Post;
