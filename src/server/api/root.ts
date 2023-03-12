import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { communityRouter } from "./routers/community";
import { postRouter } from "./routers/post";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  community: communityRouter,
  post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
