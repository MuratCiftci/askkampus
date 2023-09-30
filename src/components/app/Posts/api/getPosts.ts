/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { api } from "~/utils/api";

type GetPostsArgs = {
  sort: string;
};

export const getAllPosts = (sort: GetPostsArgs["sort"]) => {

  const getPosts: any = api.post.getAllPosts;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const getInfinitePosts = getPosts.useInfiniteQuery(
    {
      limit: 2,
      sort,
    },
    {
      getNextPageParam: (lastPage: { nextCursor: any; }) => lastPage.nextCursor,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 1 /* 1 minutes */,
      cacheTime: 1000 * 60 * 5 /* 5 minutes */,
    }
  );


  return getInfinitePosts;
};
