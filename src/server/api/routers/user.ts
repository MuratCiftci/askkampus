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

                orderBy: {
                    createdAt: "desc",
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
                orderBy: {
                    createdAt: "desc",
                },
                include: {
                    post: {
                        select: {
                            title: true,
                            id: true,
                            community: {
                                select: {
                                    id: true,
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

    getMyUserInformation: protectedProcedure.query(async ({ ctx }) => {
        const user = await ctx.prisma.user.findUnique({
            where: {
                id: ctx.session.user.id,
            },
            select: {
                id: true,
                name: true,
                image: true,
            },
        });

        return user;
    }
    ),
    getUpvotedPosts: protectedProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            where: {
                votes: {
                    some: {
                        userId: ctx.session.user.id,

                    },
                },
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
            },
        });

        return posts;
    }
    ),

    getUserInfoAndStats: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const user = await ctx.prisma.user.findUnique({
                where: {
                    id: input.id,
                },
                select: {
                    id: true,
                    name: true,
                    image: true,
                    _count: {
                        select: {
                            posts: true,
                            comments: true,
                        },
                    },
                },
            });

            return user;
        }
        ),

});




