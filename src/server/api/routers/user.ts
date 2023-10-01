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
    togglePostToFavorites: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const post = await ctx.prisma.post.findUnique({
                where: {
                    id: input.id,
                },
            });

            if (!post) {
                throw new Error("Post not found");
            }

            // check if user already favorited this post
            const favorite = await ctx.prisma.postFavorite.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    postId: post.id,
                },
            });

            if (favorite) {
                // delete favorite
                const deletedFavorite = await ctx.prisma.postFavorite.delete({
                    where: {
                        id: favorite.id,
                    },
                });

                return deletedFavorite;
            }

            const newFavorite = await ctx.prisma.postFavorite.create({
                data: {
                    userId: ctx.session.user.id,
                    postId: post.id,

                },
            });

            return newFavorite;

        }
        ),
    removePostFromFavorites: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const post = await ctx.prisma.post.findUnique({
                where: {
                    id: input.id,
                },
            });

            if (!post) {
                throw new Error("Post not found");
            }

            const deletedFavorite = await ctx.prisma.postFavorite.deleteMany({
                where: {
                    userId: ctx.session.user.id,
                    postId: post.id,
                },
            });

            return deletedFavorite;

        }
        ),
    getFavoritePosts: protectedProcedure.query(async ({ ctx }) => {
        const posts = await ctx.prisma.post.findMany({
            where: {
                favorites: {
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
    joinEvent: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const event = await ctx.prisma.event.findUnique({
                where: {
                    id: input.id,
                },
            });

            if (!event) {
                throw new Error("Event not found");
            }

            const user = await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    events: {
                        connect: {
                            id: event.id,
                        },
                    },
                },
            });

            return user;
        }),
    leaveEvent: protectedProcedure.
        input(z.object({ id: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const event = await ctx.prisma.event.findUnique({
                where: {
                    id: input.id,
                },
            });

            if (!event) {
                throw new Error("Event not found");
            }

            const user = await ctx.prisma.user.update({
                where: {
                    id: ctx.session.user.id,
                },
                data: {
                    events: {
                        disconnect: {
                            id: event.id,
                        },
                    },
                },
            });

            return user;
        }),
    getMyEvents: protectedProcedure.query(async ({ ctx }) => {
        const events = await ctx.prisma.event.findMany({
            where: {
                attendees: {
                    some: {
                        id: ctx.session.user.id,

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
                attendees: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return events;
    }),
});

