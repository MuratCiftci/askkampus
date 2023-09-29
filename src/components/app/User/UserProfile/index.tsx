import { useRouter } from "next/router";
import React from "react";
import Tabs from "~/components/shared/ui/Tabs";
import PostCard from "../../PostCard";
import UserPosts from "../UserPosts";
import UserComments from "../UserComments";

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { type } = router.query as { type: string };
  const { sort } = router.query as { sort: "new" | "top" };
  const tabs = [
    {
      key: "posts",
      name: "Paylaşımlar",
      path: `/user/${id}?type=posts`,
    },
    {
      key: "comments",
      name: "Yorumlar",
      path: `/user/${id}?type=comments`,
    },
  ];

  return (
    <div className="container mt-4 flex flex-col items-center justify-center">
      <Tabs tabs={tabs} />
      {type === "posts" ? (
        <UserPosts id={id} sortBy={sort} />
      ) : (
        <UserComments id={id} />
      )}
    </div>
  );
};

export default UserProfile;
