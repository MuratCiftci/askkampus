import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import React from "react";
import { AppRouter } from "~/server/api/root";

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

type Event = RouterOutput["event"]["getSelectedMonthEvents"];
type Props = {
  disabled?: boolean;
  day: number;
  month: number;
  year: number;
  events?: Event;
  isToday?: boolean;
};
const DayCard = ({ disabled, day, events, isToday, month, year }: Props) => {
  const router = useRouter();
  const date = dayjs(`${year}-${month}-${day}`).format("YYYY-MM-DD");

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

  return (
    <td
      className={`lg:w-30 md:w-30 ease h-40 w-10 cursor-pointer overflow-auto border p-1 duration-500 transition hover:bg-blue-100 sm:w-20 xl:w-40 ${
        disabled ? "bg-gray-100" : ""
      }`}
      onClick={() => {
        if (events?.length) {
          void router.push(`/events/selected?date=${date}`);
        }
      }}
    >
      <div className="lg:w-30 md:w-30 mx-auto mx-auto flex h-40 w-10 flex-col overflow-hidden sm:w-full xl:w-30">
        <div className="top h-5 w-full">
          <span
            className={`text-sm text-gray-500 ${
              disabled ? "text-gray-500" : ""
            } ${isToday ? "rounded bg-blue-100 p-1" : ""}`}
          >
            {day}
          </span>
        </div>
        <div className="bottom h-30 w-full flex-grow cursor-pointer py-1">
          {events?.length && events?.length > 2
            ? sortedEvents?.slice(0, 2).map((event) => (
                <div
                  key={event.id}
                  className="event mt-2 flex justify-between rounded bg-blue-400 p-1 text-sm text-white"
                >
                  <span className="truncate text-opacity-100 w-28 text-left pl-1">
                    {event.name.length > 20
                      ? event.name.slice(0, 10) + "..."
                      : event.name}
                  </span>
                  <span className="text-white-500 shrink-0 font-normal dark:text-gray-400 sm:text-right">
                    {event.time}
                  </span>
                </div>
              ))
            : null}
          {events?.length && events?.length > 2 && (
            <div className="event mt-2 flex justify-between rounded bg-blue-400 p-1 text-sm text-white">
              <span className="truncate text-opacity-100 text-left pl-1">
                {events.length - 2} tane daha...
              </span>
            </div>
          )}
          {events?.length &&
            events?.length <= 2 &&
            sortedEvents?.map((event) => (
              <div
                key={event.id}
                className="event mt-2 flex justify-between rounded bg-blue-400 p-1 text-sm text-white"
              >
                <span className="truncate text-opacity-100 text-left pl-1">
                  {event.name.length > 20
                    ? event.name.slice(0, 10) + "..."
                    : event.name}
                </span>
                <span className="text-white-500 shrink-0 font-normal dark:text-gray-400 sm:text-right">
                  {event.time}
                </span>
              </div>
            ))}

          {/* <div className="event mb-1 rounded bg-purple-400 p-1 text-sm text-white">
            <span className="event-name">Meeting</span>
            <span className="time">12:00~14:00</span>
          </div>
          <div className="event mb-1 rounded bg-purple-400 p-1 text-sm text-white">
            <span className="event-name">Meeting</span>
            <span className="time">18:00~20:00</span>
          </div> */}
        </div>
      </div>
    </td>
  );
};

export default DayCard;
