import { useRouter } from "next/router";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "~/components/hooks/ui/use-toast";
import { api } from "~/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import PostCard from "~/components/app/PostCard";
import CommunityStatsCard from "~/components/app/CommunityStatsCard";
import CommunityBanner from "~/components/app/CommunityBanner";
import NoFound from "~/components/app/NoFound";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";
import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "~/server/api/root";

type FormValues = {
  title: string;
  description: string;
};

type RouterOutput = inferRouterOutputs<AppRouter>;
type Post = RouterOutput["post"]["getAllPosts"]["posts"][number];
type UserPosts = RouterOutput["user"]["getUserPosts"][number];
type PostWithUser = Post & UserPosts;


const Community = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };

  const utils = api.useContext();
  const [activeTab, setActiveTab] = React.useState("new");

  const { data: posts, isError } = api.post.getPostsByCommunity.useQuery({
    id: id,
  });

  const { data: community, isLoading } =
    api.community.getCommunityInfo.useQuery({
      id: id,
    });

  if (isError) {
    return <div>Error</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const communityBanner = {
    name: community?.name || "",
    image_url: community?.image_url || "",
  };

  const tabs = [
    {
      label: "En Yeni",
      value: "new",
      desc: `Topluluk paylaşımları burada görüntülenir. Yeni,popüler ve en çok yorum olarak sıralayabilirsiniz.`,
      path: `/community/${id}?sort=new`,
    },
    {
      label: "En Çok Beğenilen",
      value: "top",
      desc: `Topluluk paylaşımlar burada görüntülenir. Yeni,popüler ve en çok yorum  olarak sıralayabilirsiniz.`,
      path: `/community/${id}?sort=most-liked`,
    },
    {
      label: "En Çok Yorum Alan",
      value: "comments",
      desc: `Topluluk paylaşımlar burada görüntülenir. Yeni,popüler ve en çok yorum olarak sıralayabilirsiniz.`,
      path: `/community/${id}?sort=most-commented`,
    },
  ];

  return (
    <div className="h-full w-full">
      <CommunityBanner community={communityBanner} />
      <div className=" flex flex-row items-start justify-start dark:bg-gray-900">
        <div className=" bg-white-50 container flex flex-col items-center justify-center border-r border-gray-300 dark:border-gray-700 dark:bg-gray-900 mt-8">
          {posts?.length === 0 ? (
            <NoFound />
          ) : (
            <>
              <TabWithAnimation data={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
              {posts?.map((post : PostWithUser) => (
                <Link href={`/post/${post.id}`} key={post.id}>
                  <div className="align-center flex w-full cursor-pointer flex-col items-center justify-center gap-2 ">
                    <PostCard post={post} />
                  </div>
                </Link>
              ))}
            </>
          )}
        </div>
        <CommunityStatsCard id={id} />
      </div>
    </div>
  );
};

export default Community;
