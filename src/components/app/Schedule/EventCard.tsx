import React from "react";
import Style from "./index.module.css";
import Badge from "~/components/shared/ui/Badge";
import Avatar from "~/components/shared/ui/Avatar";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import dayjs from "dayjs";
import { useRouter } from "next/router";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

type Event = RouterOutput["event"]["getEventsByType"][number];

type EventCardProps = {
  event: Event;
  type: "today" | "tomorrow" | "future" | "selectedDay";
};

const EventCard = ({ event, type }: EventCardProps) => {
  const router = useRouter();
  return (
    <div className={Style.event}>
      <div className={Style.badge}>
        <Badge type="primary"> {event.time} </Badge>
        {type === "future" && (
          <Badge type="secondary">
            {" "}
            {dayjs(event.date).format("DD MMMM YYYY")}{" "}
          </Badge>
        )}
      </div>
      <div className={Style.eventTitle}> {event.name} </div>
      <div className={Style.eventDescription}>
        <Avatar
          size="small"
          // random
          src={event.community.image_url}
        />
        <div className={Style.eventDescriptionText}>
          <div
            className={Style.eventDescriptionTextTitle}
            onClick={() => {
              void router.push(`/community/${event.communityId}`);
            }}
          >
            {event.community.name}{" "}
            <span className="text-sm text-gray-500"> topluluğu tarafından</span>
          </div>
          <div className={Style.eventDescriptionTextDescription}>
            {event.description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
