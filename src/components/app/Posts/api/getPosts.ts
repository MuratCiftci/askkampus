import { api } from "~/utils/api";

export const getAllPosts = () => {
  const getInfinitePosts = api.post.getAllPosts.useInfiniteQuery(
    {
      limit: 2,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  console.log(getInfinitePosts, "getInfinitePosts");

  return getInfinitePosts;
};
