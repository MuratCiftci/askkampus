import React, { useRef } from "react";
import { getAllPosts } from "./api/getPosts";
import PostCard from "../PostCard";
import { api } from "~/utils/api";
import { Button } from "~/components/shared/ui/Button";
import useInfiniteScroll from "~/components/hooks/useInfiniteQuery";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";
import { useRouter } from "next/router";
import CardSkeleton from "~/components/shared/ui/CardSkeleton";
import PostSkeleton from "~/components/shared/ui/PostSkeleton";

const Posts = () => {
  const router = useRouter();
  const sort = router.query.sort as "new" | "most-liked" | "most-commented";

  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    getAllPosts(sort || "new");
  const [activeTab, setActiveTab] = React.useState(sort || "new");

  const loadMore = () => {
    fetchNextPage().catch((error) => {
      console.error("Error loading more:", error);
    });
  };

  const target = useRef<HTMLDivElement>(null);

  useInfiniteScroll(loadMore, target);

  const tabs = [
    {
      label: "En Yeni",
      value: "new",
      desc: `Kullanıcı paylaşımları burada görüntülenir. Yeni,popüler ve en çok yorum olarak sıralayabilirsiniz.`,
      path: `/?sort=new`,
    },
    {
      label: "En Çok Beğenilen",
      value: "most-liked",
      desc: `Kullanıcı yorumları burada görüntülenir. Yeni,popüler ve en çok yorum  olarak sıralayabilirsiniz.`,
      path: `/?sort=most-liked`,
    },
    {
      label: "En Çok Yorum Alan",
      value: "most-commented",
      desc: `Kullanıcı yorumları burada görüntülenir. Yeni,popüler ve en çok yorum olarak sıralayabilirsiniz.`,
      path: `/?sort=most-commented`,
    },
  ];

  return (
    <div className="mt-4 w-full">
      <TabWithAnimation
        data={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {status === "loading" ? (
        <div className="flex flex-col gap-12">
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : status === "error" ? (
        <div> Bir şeyler ters gitti...</div>
      ) : (
        data?.pages.map((page, i) => {
          return (
            <div key={i} className="flex flex-col gap-2">
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
