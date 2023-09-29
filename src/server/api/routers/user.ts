import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({

    getUserPosts: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {



            const posts = await ctx.prisma.post.findMany({
                where: {
                    userId: input.id,
                },


                include: {
                    community: {
                        select: {
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
            });

            return posts;
        }),

    getUserComments: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const comments = await ctx.prisma.comment.findMany({
                where: {
                    userId: input.id,
                },
                include: {
                    post: {
                        select: {
                            title: true,
                            id: true,
                            community: {
                                select: {
                                    name: true,
                                },
                            },
                        },
                    },
                    user: {
                        select: {
                            name: true,
                            id: true,
                        },
                    },

                },
            });

            return comments;
        }
        ),


});




