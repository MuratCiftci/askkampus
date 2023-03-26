import { api } from "~/utils/api";

export const getAllPosts = () => {
  const getInfinitePosts = api.post.getAllPosts.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      cacheTime: 1000 * 60 * 10 /* 10 minutes */,
    }
  );

  console.log(getInfinitePosts, "getInfinitePosts");

  return getInfinitePosts;
};
