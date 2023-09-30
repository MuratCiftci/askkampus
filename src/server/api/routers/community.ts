import dayjs from "dayjs";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

dayjs.tz.setDefault('Europe/Istanbul');  

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

  createCommunity: protectedProcedure
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

  // get community posts length , image , name , description and total joined users 
  // also check if user joined this community or not

  getCommunityInfo: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const community = await ctx.prisma.community.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          name: true,
          image_url: true,
          description: true,
          _count: {
            select: {
              users: true,
              posts: true,
            },
          },
          users: {
            where: {
              id: ctx?.session?.user.id,
            },
            select: {
              id: true,
            },
          },
        },
      });


      return community;
    }
    ),


  getCommunityNameAndId: publicProcedure.query(async ({ ctx }) => {
    const communities = await ctx.prisma.community.findMany({
      select: {
        id: true,
        name: true,
      }
    });

    return communities;
  }),

  getCommunityNameAndIdAndImage: publicProcedure.query(async ({ ctx }) => {
    const communities = await ctx.prisma.community.findMany({
      select: {
        id: true,
        name: true,
        image_url: true,
        description: true,
      }
    });

    return communities;
  }
  ),
  getLatestCommunities: publicProcedure.query(async ({ ctx }) => {
    const communities = await ctx.prisma.community.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        image_url: true,
        description: true,
        createdAt: true,
      },
      take: 5,
    });

    return communities;
  }
  ),
  getTopCommunities: publicProcedure.query(async ({ ctx }) => {
    const communities = await ctx.prisma.community.findMany({
      select: {
        id: true,
        name: true,
        image_url: true,
        description: true,
        createdAt: true,
        _count: {
          select: {
            users: true,
          },
        },
      },
      orderBy: {
        users: {
          _count: "desc",
        }
      },
      take: 5,
    },
    );
    return communities;
  }
  ),

  getAllCommunities: publicProcedure
    .input(z.object({ search: z.string(), sort: z.string() }))
    .query(async ({ ctx, input }) => {

      let orderByClause: {
        [key: string]: "asc" | "desc" | {
          _count: "asc" | "desc";
        };
      } = {

        createdAt: "desc",
      };



      if (input.sort === "most-followed") {
        // Sort by most liked
        orderByClause = {
          users: {
            _count: "desc",
          },
        }
      } else if (input.sort === "most-posted") {
        // Sort by most posts
        orderByClause = {
          posts: {
            _count: "desc",
          },
        }
      }


      const communities = await ctx.prisma.community.findMany({
        orderBy: orderByClause,
        where: {
          name: {
            contains: input.search,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          image_url: true,
          description: true,
          createdAt: true,
          _count: {
            select: {
              users: true,
              posts: true,
            },
          },
        },
      });

      return communities;
    }
    ),


  createNewEvent: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        location: z.string(),
        communityId: z.string(),
        date: z.string(),
        time: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // date with time 
      // const date = dayjs(input.date).toDate();
      // const time = dayjs(input.time).toDate();

      const date = dayjs(input.date);
      console.log("date", date);
      const hour = input.time.split(":")[0];
      const minute = input.time.split(":")[1];
      console.log("hour", hour, "minute", minute);
      const dateTime = date.hour(parseInt(hour || "0")).minute(parseInt(minute || "0")).tz("Europe/Istanbul").toDate();

      console.log("dateTime", dateTime);


      const createdEvent = await ctx.prisma.event.create({
        data: {
          name: input.name,
          description: input.description,
          location: input.location,
          date: dateTime,
          time: input.time,
          community: {
            connect: { id: input.communityId }, // Connect the event to the community.
          },
          attendees: {
            connect: { id: ctx?.session?.user.id }, // Connect the event to the user.
          },
        },
      });
      return createdEvent;
    }
    ),
});








