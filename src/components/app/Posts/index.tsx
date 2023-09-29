import React, { useRef } from "react";
import { getAllPosts } from "./api/getPosts";
import PostCard from "../PostCard";
import { api } from "~/utils/api";
import { Button } from "~/components/shared/ui/Button";
import useInfiniteScroll from "~/components/hooks/useInfiniteQuery";

const Posts = () => {
  const { data, error, fetchNextPage, hasNextPage, isFetching, status } =
    getAllPosts();

  const createPost = api.post.createPost.useMutation();

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

  return (
    <div className="mt-4 w-full">
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
