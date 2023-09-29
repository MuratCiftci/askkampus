import React from "react";
import { api } from "~/utils/api";
import PostCard from "../../PostCard";
import Tabs from "~/components/shared/ui/Tabs";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";
type UserPostsProps = {
  id: string;
  sortBy: "new" | "top";
};

const UserPosts = ({ id, sortBy }: UserPostsProps) => {
  const {
    isLoading,
    data: posts,
    error,
  } = api.user.getUserPosts.useQuery({ id: id });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }



  return (
    <>
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </>
  );
};

export default UserPosts;
