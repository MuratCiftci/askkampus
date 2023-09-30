import { api } from "~/utils/api";

type GetPostsArgs = {
  sort: "new" | "most-liked" | "most-commented";
};

export const getAllPosts = (sort: GetPostsArgs["sort"]) => {
  const getInfinitePosts = api.post.getAllPosts.useInfiniteQuery(
    {
      limit: 2,
      sort,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 1 /* 10 minutes */,
      cacheTime: 1000 * 60 * 5 /* 10 minutes */,
    }
  );


  return getInfinitePosts;
};
