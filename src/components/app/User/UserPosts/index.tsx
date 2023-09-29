import React from "react";
import { api } from "~/utils/api";
import PostCard from "../../PostCard";
import Tabs from "~/components/shared/ui/Tabs";
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

  const tabs = [
    {
      key: "new",
      name: "Yeni",
      path: `/user/${id}?type=posts&sort=new`,
    },
    {
      key: "top",
      name: "Popüler",
      path: `/user/${id}?type=posts&sort=top`,
    },
  ];

  return (
    <>
      <Tabs tabs={tabs} />
      {posts.map((post) => (
        <PostCard post={post} key={post.id} />
      ))}
    </>
  );
};

export default UserPosts;
