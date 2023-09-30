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
        cursor: z.string().nullish(),
        sort: z.enum(["new", "most-liked", "most-commented"]).nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const take = limit + 1;


      let orderByClause: {
        [key: string]: "asc" | "desc" | {
          _count: "asc" | "desc";
        };
      } = {
        createdAt: "desc",
      };


      if (input.sort === "most-liked") {
        // Sort by most liked
        orderByClause = {
          votes: {
            _count: "desc",
          },
        }
      } else if (input.sort === "most-commented") {
        // Sort by most commented
        orderByClause = {
          comments: {
            _count: "desc",
          },
        }
      }



      const { cursor } = input;
      const posts = await ctx.prisma.post.findMany({
        orderBy: orderByClause,
        take: take,
        include: {
          community: {
            select: {
              id: true,
              name: true,
              image_url: true,
            },
          },
          user: {
            select: {
              name: true,
              id: true,
            },
          },

          _count: {
            select: {
              votes: true,
            },
          },
        },

        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem?.id;
      }

      return {
        posts,
        nextCursor,
      };
    }),

  getPostByIdAndCommunity: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
        },
        include: {
          community: {
            select: {
              id: true,
              name: true,
              image_url: true,
            },
          },
          user: {
            select: {
              name: true,
              id: true,
            },
          },

          _count: {
            select: {
              votes: true,
            },
          },

          // check if user has voted on this post
          votes: {
            where: {
              userId: ctx?.session?.user.id,
            },
          },

        },
      });

      return post;
    }),

  createPost: protectedProcedure
    .input(
      z.object({ title: z.string(), body: z.string(), community: z.string(), image_url: z.string() })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.create({
        data: {
          title: input.title,
          body: input.body,
          image_url: input.image_url ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
          community: {
            connect: { id: input.community },
          },
          user: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
      // return community name 
      const community = await ctx.prisma.community.findUnique({
        where: {
          id: input.community,
        },
        select: {
          name: true,
        },
      });

      const postWithCommunity = {
        ...post,
        community: community,
      };

      return postWithCommunity;
    }),

  getPostsByCommunity: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          community: {
            id: input.id,
          },
        },
        select: {
          id: true,
          title: true,
          body: true,
          createdAt: true,
          updatedAt: true,
          image_url: true,
          communityId: true,
          user: {
            select: {
              name: true,
              id: true,
            },
          },
          _count: {
            select: {
              votes: true,
            },
          },
          community: {
            select: {
              id: true,
              name: true,
              image_url: true,
            },
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
          post: {
            include: {
              community: {
                select: {
                  id: true,
                  name: true,
                },
              },
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
  toggleVote: protectedProcedure
    .input(z.object({ postId: z.string(), voteType: z.enum(["UPVOTE", "DOWNVOTE"]) }))
    .mutation(async ({ ctx, input }) => {
      const { postId, voteType } = input
      const userId = ctx.session.user.id;

      // Check if the user has already voted on this post
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const existingVote = await ctx.prisma.postVote.findFirst({
        where: {
          postId,
          userId,
        },
      });


      if (existingVote) {
        // User has already voted, so we need to remove the vote
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        await ctx.prisma.postVote.update({
          where: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            id: existingVote.id,
          },
          data: {
            voteType,
          },
        });
      }
      else {
        // User has not voted, so we need to add the vote
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
        await ctx.prisma.postVote.create({
          data: {
            voteType,
            Post: {
              connect: {
                id: postId,
              },
            },
            user: {
              connect: {
                id: userId,
              },
            },
          },
        });
      }

    }),

  checkIfUserHasVoted: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // Check if the user has already voted on this post
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      const existingVote = await ctx.prisma.postVote.findFirst({
        where: {
          postId: input.postId,
          userId,
        },
      });
      if (!existingVote) {
        return null;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return existingVote;
    }),

});


