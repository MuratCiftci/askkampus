import React, { useRef } from "react";
import { getAllPosts } from "./api/getPosts";
import PostCard from "../PostCard";
import { api } from "~/utils/api";
import { Button } from "~/components/shared/ui/Button";
import useInfiniteScroll from "~/components/hooks/useInfiniteQuery";
import { TabWithAnimation } from "~/components/shared/ui/TabWithAnimation";

const Posts = () => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    getAllPosts();
  const [activeTab, setActiveTab] = React.useState("new");

  const loadMore = () => {
    fetchNextPage().catch((error) => {
      console.error("Error loading more:", error);
    });
  };

  const target = useRef<HTMLDivElement>(null);

  useInfiniteScroll(loadMore, target);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }
  const tabs = [
    {
      label: "En Yeni",
      value: "new",
      desc: `Kullanıcı paylaşımları burada görüntülenir. Yeni,popüler ve en çok yorum olarak sıralayabilirsiniz.`,
      path: `/?sort=new`,
    },
    {
      label: "En Çok Beğenilen",
      value: "top",
      desc: `Kullanıcı yorumları burada görüntülenir. Yeni,popüler ve en çok yorum  olarak sıralayabilirsiniz.`,
      path: `/?sort=most-liked`,
    },
    {
      label: "En Çok Yorum Alan",
      value: "comments",
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
      {data?.pages.map((page, i) => {
        return (
          <div key={i}>
            {page.posts.map((post) => (
              <PostCard post={post} key={post.id} />
            ))}
          </div>
        );
      })}
      {hasNextPage ? <div ref={target} className="h-10" /> : null}
      {/* Infinite Scroll */}
      {isFetching ? <div>Loading...</div> : null}
    </div>
  );
};

export default Posts;
