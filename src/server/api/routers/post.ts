import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getAllPosts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish()
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const take = limit + 1;
      console.log(limit, 'limit')
      console.log(take, 'take')
      const postsCount = await ctx.prisma.post.count();
      console.log(postsCount, 'postsCount')
      const { cursor } = input;
      const posts = await ctx.prisma.post.findMany({
        take:  take,
        include: {
          community: {
            select: {
              name: true,
            },
          },
          user: {
            select: {
              name: true,
            },
          },
        },
        cursor: cursor ? {  id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      debugger
      console.log(posts.length, 'posts')
      console.log(limit, 'limit')
      if (posts.length > limit) {
        const nextItem = posts.pop();
        console.log(nextItem, 'nextItem' )
        nextCursor = nextItem?.id;
      }

      
      return {
        posts,
        nextCursor,
      };
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

  addComment: protectedProcedure
    .input(z.object({ postId: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.prisma.comment.create({
        data: {
          body: input.body,
          createdAt: new Date(),
          updatedAt: new Date(),
          post: {
            connect: { id: input.postId },
          },
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });

      return comment;
    }),

  getComments: publicProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          replies: {
            select: {
              id: true,
              body: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              children: {
                select: {
                  id: true,
                  body: true,
                  createdAt: true,
                  updatedAt: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      image: true,
                    },
                  },
                },
                skip: 0,
                take: 3,
              },
            },
            skip: 0,
            take: 3,
          },
        },
      });

      return comments;
    }),

  addReply: protectedProcedure
    .input(z.object({ commentId: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const reply = await ctx.prisma.reply.create({
        data: {
          body: input.body,
          comment: {
            connect: {
              id: input.commentId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return reply;
    }),

  addReplyToReply: protectedProcedure
    .input(
      z.object({
        reply_id: z.string(),
        body: z.string(),
        comment_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const reply = ctx.prisma.reply.create({
        data: {
          body: input.body,
          parent: {
            connect: {
              id: input.reply_id,
            },
          },
          comment: {
            connect: {
              id: input.comment_id,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return reply;
    }),
  upvotePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.update({
        where: {
          id: input.postId,
        },

        data: {
          voteCount: {
            increment: 1,
          },

          votes: {
            create: {
              user: {
                connect: {
                  id: ctx.session.user.id,
                },
              },
            },
          },
        },
      });

      return post;
    }),
});
