import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const communityRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  getCommunities: publicProcedure.query(async ({ ctx }) => {
    const communities = await ctx.prisma.community.findMany();

    return communities;
  }),

  getCommunity: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const community = await ctx.prisma.community.findUnique({
        where: {
          name: input.name,
        },
      });

      return community;
    }),

  createCommunity: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const community = await ctx.prisma.community.create({
        data: {
          name: input.name,
          description: "This is a description",
          image_url: "https://picsum.photos/200",
          title: "This is a title",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return community;
    }),
});
