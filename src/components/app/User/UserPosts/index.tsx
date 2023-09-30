import React from "react";
import { api } from "~/utils/api";
import PostCard from "../../PostCard";
import Tabs from "~/components/shared/ui/Tabs";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";
import { useRouter } from "next/router";
type UserPostsProps = {
  id: string;
  sortBy: "new" | "top";
};

const UserPosts = ({ id }: UserPostsProps) => {
  const router = useRouter();
  const sort = router.query.sort as "new" | "top";
  const {
    isLoading,
    data: posts,
    error,
  } = api.user.getUserPosts.useQuery({ id: id , sort: sort});

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
