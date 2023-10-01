import { createTRPCRouter } from "~/server/api/trpc";
import { communityRouter } from "./routers/community";
import { postRouter } from "./routers/post";
import { userRouter } from "./routers/user";
import { eventsRouter } from "./routers/events";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  community: communityRouter,
  post: postRouter,
  user : userRouter,
  event : eventsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
