/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useRef } from "react";
import { getAllPosts } from "./api/getPosts";
import PostCard from "../PostCard";
import useInfiniteScroll from "~/components/hooks/useInfiniteQuery";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";
import { useRouter } from "next/router";
import CardSkeleton from "~/components/shared/ui/CardSkeleton";
import PostSkeleton from "~/components/shared/ui/PostSkeleton";
import Tabs from "~/components/shared/ui/Tabs";

const Posts = () => {
  const router = useRouter();
  const sort = router.query.sort as string;

  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    getAllPosts(sort || "new");

  const loadMore = () => {
    fetchNextPage().catch((error: any) => {
      console.error("Error loading more:", error);
    });
  };

  const target = useRef<HTMLDivElement>(null);

  useInfiniteScroll(loadMore, target);

  const tabs = [
    {
      label: "Takip Edilenler",
      value: "followed",
      desc: `Kullanıcı paylaşımları burada görüntülenir. Yeni,popüler ve en çok yorum olarak sıralayabilirsiniz.`,
      path: "/followed",
    },
    {
      label: "Tümü",
      value: "all",
      desc: `Kullanıcı paylaşımları burada görüntülenir. Yeni,popüler ve en çok yorum olarak sıralayabilirsiniz.`,
      path: "/",
    },
  ];

  const sortTabs = [
    { key: "new", name: "En Yeni", path: "/?sort=new", isDefault: true },
    {
      key: "most-liked",
      name: "En Çok Beğenilen",
      path: "/?sort=most-liked",
    },
    {
      key: "most-commented",
      name: "En Çok Yorum Alan",
      path: "/?sort=most-commented",
    },
  ];

  return (
    <div className="mt-4 w-full">
      <TabWithAnimation data={tabs} activeTab="all" />
      <div className="flex flex-row items-center justify-center  w-full gap-4 m-w-2xl">
        <Tabs tabs={sortTabs} />
      </div>
      {status === "loading" ? (
        <div className="flex flex-col gap-12">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : status === "error" ? (
        <div> Bir şeyler ters gitti...</div>
      ) : (
        data?.pages.map((page: { posts: any[] }, i: React.Key) => {
          return (
            <div key={i} className="align-center items-center flex flex-col gap-2">
              {page.posts.map((post) => (
                <PostCard post={post} key={post.id} />
              ))}
            </div>
          );
        })
      )}
      {hasNextPage ? <div ref={target} className="h-10" /> : null}
      {/* Infinite Scroll */}
      {isFetching ? <PostSkeleton /> : null}
    </div>
  );
};

export default Posts;
