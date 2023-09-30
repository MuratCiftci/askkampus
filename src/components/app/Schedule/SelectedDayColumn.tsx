import React from "react";
import Style from "./index.module.css";
import dayjs from "dayjs";
import Badge from "~/components/shared/ui/Badge";
import Avatar from "~/components/shared/ui/Avatar";
import { api } from "~/utils/api";
import EventCard from "./EventCard";
import Back from "~/components/shared/icons/Back";
import Forward from "~/components/shared/icons/Forward";
import { useRouter } from "next/router";
import { Button } from "~/components/shared/ui/Button";

type ScheduleColumnProps = {
  selectedDate: string;
};

const SelectedDayColumn = ({ selectedDate }: ScheduleColumnProps) => {
  const router = useRouter();
  const { isLoading, data: events } = api.event.getSelectedDayEvents.useQuery({
    day: dayjs(selectedDate).date(),
    month: dayjs(selectedDate).month() + 1,
    year: dayjs(selectedDate).year(),
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
      <div className={Style.headerContainer}>
        <Button 
          onClick={() => {
            void router.push(
              `/events/selected?date=${dayjs(selectedDate)
                .subtract(1, "day")
                .format("YYYY-MM-DD")}`
            );
          }}

        >
          <Back />
        </Button>
        <h3 className={Style.scheduleColumnTitle}>
          {dayjs(selectedDate).format("dddd, MMMM D")}
        </h3>
        <Button
          onClick={() => {
            void router.push(
              `/events/selected?date=${dayjs(selectedDate)
                .add(1, "day")
                .format("YYYY-MM-DD")}`
            );
          }}
        >
          <Forward />
        </Button>
      </div>

      {sortedEvents?.map((event) => (
        <EventCard key={event.id} event={event} type="selectedDay" />
      ))}
    </div>
  );
};

export default SelectedDayColumn;
