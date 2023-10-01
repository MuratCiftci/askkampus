import React from "react";
import Style from "./index.module.css";
import Badge from "~/components/shared/ui/Badge";
import Avatar from "~/components/shared/ui/Avatar";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "~/server/api/root";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "~/components/shared/ui/Button";
import { api } from "~/utils/api";
import { toast } from "~/components/hooks/ui/use-toast";
import { useSession } from "next-auth/react";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

type Event = RouterOutput["event"]["getEventsByType"][number];

type EventCardProps = {
  event: Event;
  type: "today" | "tomorrow" | "future" | "selectedDay";
};

const EventCard = ({ event, type }: EventCardProps) => {
  const router = useRouter();
  const utils = api.useContext();
  const { data } = useSession();
  console.log(data);
  const joinEvent = api.user.joinEvent.useMutation({
    onSuccess: async () => {
      await utils.event.getEventsByType.invalidate();
      await utils.event.getSelectedDayEvents.invalidate();
      toast({ title: "Etkinliğe katıldınız" });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const leaveEvent = api.user.leaveEvent.useMutation({
    onSuccess: async () => {
      await utils.event.getEventsByType.invalidate();
      await utils.event.getSelectedDayEvents.invalidate();
      toast({ title: "Etkinlikten ayrıldınız" });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const isAttending = event.attendees.some(
    (attendee) => attendee.id === data?.user?.id
  );

  return (
    <div className={Style.event}>
      <div className={Style.badge}>
        <div className={Style.badgeIcon}>
          <Badge type="primary"> {event.time} </Badge>
          {type === "future" && (
            <Badge type="secondary">
              {" "}
              {dayjs(event.date).format("DD MMMM YYYY")}{" "}
            </Badge>
          )}

          <span className="text-sm text-gray-500">
            {" "}
            {event.attendees.length} kişi katılıyor
          </span>
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (isAttending) {
                leaveEvent.mutate({ id: event.id });
              } else {
                joinEvent.mutate({ id: event.id });
              }
            }}
          >
            {isAttending ? "Katılmaktan Vazgeç" : "Katıl"}
          </Button>
        </div>
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
          {event.attendees.length > 0 && (
            <div className="flex -space-x-4">
              {event.attendees.slice(0, 5).map((attendee) => (
                <img
                  key={attendee.id}
                  src={attendee.image}
                  className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
                  alt=""
                />
              ))}
              {event.attendees.length > 5 && (
                <Link
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gray-700 text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800"
                  href="#"
                >
                  +{event.attendees.length - 5}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
