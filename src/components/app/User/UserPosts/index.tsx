import React from "react";
import { api } from "~/utils/api";
import PostCard from "../../PostCard";
import Tabs from "~/components/shared/ui/Tabs";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";
import { useRouter } from "next/router";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getAllPosts"]["posts"][number];
type UserPosts = RouterOutput["user"]["getUserPosts"][number];
type PostWithUser = Post & UserPosts;
type UserPostsProps = {
  id: string;
  sortBy: string;
};

const UserPosts = ({ id }: UserPostsProps) => {
  const router = useRouter();
  const sort = router.query.sort as string;
  const {
    isLoading,
    data: posts,
    error,
  } = api.user.getUserPosts.useQuery({ id: id, sort: sort });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <>
      {posts.map((post: PostWithUser) => (
        <PostCard post={post} key={post.id} />
      ))}
    </>
  );
};

export default UserPosts;
