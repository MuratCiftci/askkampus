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


export const eventsRouter = createTRPCRouter({
    getEventsByType: publicProcedure
        .input(z.object({ type: z.enum(["today", "tomorrow", "future"]) }))
        .query(async ({ ctx, input }) => {
            const today = dayjs().startOf("day");
            const tomorrow = today.add(1, "day");
            const future = today.add(2, "day");



            let startDate, endDate;

            if (input.type === "today") {
                startDate = today;
                endDate = today.endOf("day");
            } else if (input.type === "tomorrow") {
                startDate = tomorrow;
                endDate = tomorrow.endOf("day");
            } else { // "future"
                startDate = future;
                endDate = future.endOf("day").add(1, "year");
            }

            // now 
            console.log("now", dayjs().toDate());
            console.log(startDate.toDate(), endDate.toDate(), input.type);


            // Retrieve events from the database
            const events = await ctx.prisma.event.findMany({
                where: {
                    AND: [
                        { date: { gte: startDate.toDate() } },
                        { date: { lt: endDate.toDate() } }
                    ]
                },
                orderBy: {
                    date: "asc"
                },
                include: {
                    community: {
                        select: {
                            name: true,
                            image_url: true
                        }
                    }
                },

            });

            return events;
        }),
    getEvent: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const event = await ctx.prisma.event.findUnique({
                where: {
                    id: input.id,
                },
            });

            return event;
        }),
    deleteEvent: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const event = await ctx.prisma.event.delete({
                where: {
                    id: input.id,
                },
            });

            return event;
        }),
    updateEvent: protectedProcedure
        .input(z.object({
            id: z.string(),
            name: z.string(),
            description: z.string(),
            location: z.string(),
            communityId: z.string(),
            date: z.string(),
            time: z.string(),
        }))
        .mutation(async ({ ctx, input }) => {
            const date = dayjs(input.date);
            console.log("date", date);
            const hour = input.time.split(":")[0];
            const minute = input.time.split(":")[1];
            console.log("hour", hour, "minute", minute);
            const dateTime = date.hour(parseInt(hour || "0")).minute(parseInt(minute || "0")).tz("Europe/Istanbul").toDate();


            const event = await ctx.prisma.event.update({
                where: {
                    id: input.id,
                },
                data: {
                    name: input.name,
                    description: input.description,
                    location: input.location,
                    date: dateTime,
                    time: input.time,
                    community: {
                        connect: {
                            id: input.communityId
                        }
                    }
                },
            });

            return event;
        }),

    getEventsDetails: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const event = await ctx.prisma.event.findUnique({
                where: {
                    id: input.id,
                },
                include: {
                    attendees: true,
                    community: true,
                }
            });

            return event;
        }),
    getEventsByCommunity: publicProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const events = await ctx.prisma.event.findMany({
                where: {
                    communityId: input.id,
                },
                include: {
                    attendees: true,
                    community: true,
                }
            });

            return events;
        }),
    getSelectedMonthEvents: publicProcedure
        .input(z.object({ month: z.number(), year: z.number() }))
        .query(async ({ ctx, input }) => {
            const { month, year } = input;
            const startDate = dayjs().month(month - 1).year(year).startOf("month");
            const endDate = startDate.endOf("month");
            console.log("startDate", startDate.toDate(), "endDate", endDate.toDate());

            const events = await ctx.prisma.event.findMany({
                where: {
                    AND: [
                        { date: { gte: startDate.toDate() } },
                        { date: { lt: endDate.toDate() } }
                    ]
                },
                orderBy: {
                    date: "asc"
                },
                include: {
                    community: {
                        select: {
                            name: true,
                            image_url: true
                        }
                    }
                },

            });

            return events;
        }),

    getSelectedDayEvents: publicProcedure
        .input(z.object({ day: z.number(), month: z.number(), year: z.number() }))
        .query(async ({ ctx, input }) => {
            const { day, month, year } = input;
            const startDate = dayjs().date(day).month(month - 1).year(year).startOf("day");
            const endDate = startDate.endOf("day");

            const events = await ctx.prisma.event.findMany({
                where: {
                    AND: [
                        { date: { gte: startDate.toDate() } },
                        { date: { lte: endDate.toDate() } }
                    ]
                },
                orderBy: {
                    date: "asc"
                },
                include: {
                    community: {
                        select: {
                            name: true,
                            image_url: true
                        }
                    }
                },

            });

            return events;
        }),

});





