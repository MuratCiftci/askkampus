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
    .input(z.object({ name: z.string(), description: z.string(), image_url: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const community = await ctx.prisma.community.create({
        data: {
          name: input.name,
          description: input.description,
          image_url: input.image_url,
          title: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return community;
    }),

  // get community posts length , image , name , description and total users
  getCommunityInfo: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const community = await ctx.prisma.community.findUnique({
        where: {
          name: input.name,
        },
        include: {
          posts: {
            select: {
              id: true,
            },
          },
        },
      });

      return community;
    }),

  joinCommunity: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const community = await ctx.prisma.community.findUnique({
        where: {
          name: input.name,
        },
      });

      if (!community) {
        throw new Error("Community not found");
      }

      const user = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {

        },
      });

      return user;
    }),

  getCommunityNameAndId: publicProcedure.query(async ({ ctx }) => {
    const communities = await ctx.prisma.community.findMany({
      select: {
        id: true,
        name: true,
      }
    });

    return communities;
  }),


});




