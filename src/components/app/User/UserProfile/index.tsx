import { useRouter } from "next/router";
import React from "react";
import Tabs from "~/components/shared/ui/Tabs";
import PostCard from "../../PostCard";
import UserPosts from "../UserPosts";
import UserComments from "../UserComments";
import UserCard from "../../UserCard";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";

const UserProfile = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { type } = router.query as { type: string };
  const { sort } = router.query as { sort: "new" | "top" };
  const [activeTab, setActiveTab] = React.useState(type || "posts");
  const data = [
    {
      label: "Paylaşımlar",
      value: "posts",
      desc: `Kullanıcı paylaşımları burada görüntülenir. Yeni ve popüler olarak sıralayabilirsiniz.`,
      path: `/user/${id}?type=posts&sort=new`,
    },
    {
      label: "Yorumlar",
      value: "comments",
      desc: `Kullanıcı yorumları burada görüntülenir. Yeni ve popüler olarak sıralayabilirsiniz.`,
      path: `/user/${id}?type=comments&sort=new`,
    },
  ];
  const tabs = [
    {
      key: "new",
      name: "Yeni",
      path: `/user/${id}?type=posts&sort=new`,
      isDefault: true,
    },
    {
      key: "top",
      name: "Popüler",
      path: `/user/${id}?type=posts&sort=top`,
    },
  ];
  return (
    <div className="flex w-full flex-row items-start justify-center">
      <div className="container mt-4 flex flex-col items-center justify-center">
        <TabWithAnimation
          data={data}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <Tabs tabs={tabs} />

        {type === "posts" ? (
          <UserPosts id={id} sortBy={sort} />
        ) : (
          <UserComments id={id} />
        )}
      </div>
      <UserCard id={id} />
    </div>
  );
};

export default UserProfile;
