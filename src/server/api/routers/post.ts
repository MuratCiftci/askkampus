import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAllPosts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany();

    return posts;
  }),

  getPostByIdAndCommunity: publicProcedure
    .input(z.object({ id: z.string(), community_name: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
          community: {
            name: input.community_name,
          },
        },
      });

      return post;
    }),

  createPost: protectedProcedure
    .input(
      z.object({ title: z.string(), body: z.string(), community: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          title: input.title,
          body: input.body,
          createdAt: new Date(),
          updatedAt: new Date(),
          community: {
            connect: { name: input.community },
          },
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });

      return post;
    }),

  getPostsByCommunity: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          community: {
            name: input.name,
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return posts;
    }),
});
