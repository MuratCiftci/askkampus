import React from "react";
import Style from "./index.module.css";

import dayjs from "dayjs";
import ScheduleColumn from "./ScheduleColumn";
const Schedule = () => {
  const today = dayjs().format("dddd, MMMM D");
  const tomorrow = dayjs().add(1, "day").format("dddd, MMMM D");
  const dayAfterTomorrow = dayjs().add(2, "day").format("dddd, MMMM D");

  return (
    <div className={Style.schedule}>
      <div className={Style.header}>
        <h1 className={Style.title}>Aktiviteler</h1>
        <p className={Style.subtitle}>
          {" "}
          {today} - {dayAfterTomorrow}
        </p>
      </div>

      <div className={Style.scheduleContainer}>
        {Array.from({ length: 3 }).map((_, index: number) => (
          <ScheduleColumn
            key={index}
            type={index === 0 ? "today" : index === 1 ? "tomorrow" : "future"}
          />
        ))}
      </div>
    </div>
  );
};

export default Schedule;
