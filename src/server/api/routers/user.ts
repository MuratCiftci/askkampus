import { z } from "zod";

import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({

    getUserPosts: publicProcedure
        .input(z.object({ id: z.string(), sort: z.string().optional() }))
        .query(async ({ ctx, input }) => {
            let orderByClause: {
                [key: string]: "asc" | "desc" | {
                    _count: "asc" | "desc";
                };
            } = {
                createdAt: "desc",
            };


            if (input.sort === "top") {
                // Sort by most liked
                orderByClause = {
                    votes: {
                        _count: "desc",
                    },
                }
            }

            const posts = await ctx.prisma.post.findMany({
                where: {
                    userId: input.id,
                },

                orderBy: orderByClause,
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

    joinCommunity: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const community = await ctx.prisma.community.findUnique({
                where: {
                    id: input.id,
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
                    communities: {
                        connect: {
                            id: community.id,
                        },
                    },
                },
            });

            return user;
        }),

    leaveCommunity: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const community = await ctx.prisma.community.findUnique({
                where: {
                    id: input.id,
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
                    communities: {
                        disconnect: {
                            id: community.id,
                        },
                    },
                },
            });

            return user;
        }),

    // delete my own comment 
    deleteComment: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const comment = await ctx.prisma.comment.findUnique({
                where: {
                    id: input.id,
                },
                select: {
                    userId: true,
                },
            });

            if (!comment) {
                throw new Error("Comment not found");
            }

            if (comment.userId !== ctx.session.user.id) {
                throw new Error("Bu yorum size ait değil");
            }

            const deletedComment = await ctx.prisma.comment.delete({
                where: {
                    id: input.id,
                },
            });

            return deletedComment;
        }),

});




