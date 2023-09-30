import React from "react";
import Style from "./index.module.css";

import dayjs from "dayjs";
import ScheduleColumn from "./ScheduleColumn";
import { useRouter } from "next/router";
import SelectedDayColumn from "./SelectedDayColumn";
const SelectedDayEvents = () => {
  const router = useRouter();
  const { date } = router.query;

  const selectedDay = dayjs(date as string).format("dddd, MMMM D");
  const selectedDayAfterTomorrow = dayjs(date as string)
    .add(2, "day")
    .format("dddd, MMMM D");

  return (
    <div className={Style.schedule}>
      <div className={Style.header}>
        <h1 className={Style.title}>Aktiviteler</h1>
      
      </div>

      <div className={Style.selectedScheduleContainer}>
        <SelectedDayColumn selectedDate={date as string} />
      </div>
    </div>
  );
};

export default SelectedDayEvents;
