import React from "react";
import Style from "./index.module.css";
import dayjs from "dayjs";
import Badge from "~/components/shared/ui/Badge";
import Avatar from "~/components/shared/ui/Avatar";
import { api } from "~/utils/api";
import EventCard from "./EventCard";

type ScheduleColumnProps = {
  type: "today" | "tomorrow" | "future";
};

const ScheduleColumn = ({ type }: ScheduleColumnProps) => {
  const { isLoading, data: events } = api.event.getEventsByType.useQuery({
    type,
  });

  const sortedEvents = events?.sort((a, b) => {
    // check date first
    const aDate = dayjs(a.date);
    const bDate = dayjs(b.date);

    if (aDate.isAfter(bDate)) {
      return 1;
    }

    const aTime = dayjs(a.time, "HH:mm");
    const bTime = dayjs(b.time, "HH:mm");

    return aTime.diff(bTime);
  });

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  if (!events) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className={Style.scheduleColumn}>
      <h3 className={Style.scheduleColumnTitle}>
        {type === "today"
          ? dayjs().format("dddd, MMMM D")
          : type === "tomorrow"
          ? dayjs().add(1, "day").format("dddd, MMMM D")
          : "Yaklaşan Etkinlikler"}
      </h3>

      {sortedEvents?.map((event) => (
        <EventCard key={event.id} event={event} type={type} />
      ))}
    </div>
  );
};

export default ScheduleColumn;
