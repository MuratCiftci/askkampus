import React from "react";
import dayjs from "dayjs";

dayjs.locale("tr");
import customParseFormat from "dayjs/plugin/customParseFormat";
import updateLocale from "dayjs/plugin/updateLocale";
import Back from "~/components/shared/icons/Back";
import Forward from "~/components/shared/icons/Forward";
import DayCard from "./DayCard";
import { api } from "~/utils/api";

const WeekDays = [
  "Pazartesi",
  "Salı",
  "Çarşamba",
  "Perşembe",
  "Cuma",
  "Cumartesi",
  "Pazar",
];

dayjs.extend(customParseFormat);
dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1, // Monday as the first day of the week
});

const Calendar = () => {
  const [date, setDate] = React.useState(new Date());

  const { isLoading, data: events } = api.event.getSelectedMonthEvents.useQuery(
    {
      month: dayjs(date).month() + 1,
      year: dayjs(date).year(),
    }
  );

  const currentYear = dayjs(date).year();
  const currentMonth = dayjs(date).month();
  const daysInCurrentMonth = dayjs(date).daysInMonth();

  const firstDayOfWeek = dayjs(`${currentYear}-${currentMonth + 1}-1`);
  const lastDayOfWeek = dayjs(
    `${currentYear}-${currentMonth + 1}-${daysInCurrentMonth}`
  );
  const firstWeekDay = firstDayOfWeek.day() === 0 ? 7 : firstDayOfWeek.day();
  const lastWeekDay = lastDayOfWeek.day();

  const getDay = (dayNumber: number, daysToAdd: number) => {
    return firstDayOfWeek
      .add(daysToAdd - firstWeekDay + dayNumber, "day")
      .date();
  };

  const dayBeforeFirstDayOfLastWeek = lastDayOfWeek
    .subtract(lastWeekDay, "day")
    .date();

  // add 28 days to first day of week to day before first day of last week
  const midWeekLength = dayBeforeFirstDayOfLastWeek === getDay(7, 21) ? 3 : 4;

  const renderFadedDays = () => {
    const days: JSX.Element[] = [];
    if (firstWeekDay === 0) return days;
    for (let i = 1; i < firstWeekDay; i++) {
      const day = firstDayOfWeek.subtract(firstWeekDay - i, "day").date();

      days.push(
        <DayCard
          key={day}
          day={day}
          disabled
          month={currentMonth + 1}
          year={currentYear}
        />
      );
    }
    return days;
  };

  const renderLastWeekDays = () => {
    const days = [] as JSX.Element[];
    if (lastWeekDay === 0) return days;
    for (let i = 1; i < lastWeekDay + 1; i++) {
      const day = lastDayOfWeek.subtract(lastWeekDay - i, "day").date();
      const isToday = dayjs().date() === day;
      const eventsData = events?.filter(
        (item) =>
          dayjs(item.date).date() === day &&
          dayjs(item.date).month() === currentMonth &&
          dayjs(item.date).year() === currentYear
      );
      if (eventsData?.length) {
        days.push(
          <DayCard
            key={day}
            day={day}
            events={eventsData}
            isToday={isToday}
            month={currentMonth + 1}
            year={currentYear}
          />
        );
        continue;
      }
      days.push(
        <DayCard
          key={day}
          day={day}
          isToday={isToday}
          month={currentMonth + 1}
          year={currentYear}
        />
      );
    }
    return days;
  };

  const renderNextMonthWeekDays = () => {
    return (
      lastWeekDay !== 7 &&
      Array.from({ length: 7 - lastWeekDay }).map((_, index) => {
        const day = lastDayOfWeek.add(index + 1, "day").date();

        return (
          <DayCard
            key={day}
            day={day}
            disabled
            month={currentMonth + 1}
            year={currentYear}
          />
        );
      })
    );
  };

  return (
    <div className="container mx-auto mt-10">
      <div className="wrapper w-full rounded bg-white shadow ">
        <div className="header flex justify-between border-b p-2">
          <span className="text-lg font-bold">
            {dayjs(date).format("MMMM YYYY")}
          </span>
          <div className="buttons">
            <button
              className="p-1"
              onClick={() =>
                setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))
              }
            >
              <Back />
            </button>
            <button
              className="p-1"
              onClick={() =>
                setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
              }
            >
              <Forward />
            </button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="lg:w-30 md:w-25 h-10 w-10 border-r p-2 text-xs sm:w-20 xl:w-30 xl:text-sm">
                <span className="hidden sm:block md:block lg:block xl:block">
                  Pazartesi
                </span>
                <span className="block sm:hidden md:hidden lg:hidden xl:hidden">
                  Paz
                </span>
              </th>

              <th className="lg:w-30 md:w-25 h-10 w-10 border-r p-2 text-xs sm:w-20 xl:w-30 xl:text-sm">
                <span className="hidden sm:block md:block lg:block xl:block">
                  Salı
                </span>
                <span className="block sm:hidden md:hidden lg:hidden xl:hidden">
                  Sal
                </span>
              </th>
              <th className="lg:w-30 md:w-25 h-10 w-10 border-r p-2 text-xs sm:w-20 xl:w-30 xl:text-sm">
                <span className="hidden sm:block md:block lg:block xl:block">
                  Çarşamba
                </span>
                <span className="block sm:hidden md:hidden lg:hidden xl:hidden">
                  Çar
                </span>
              </th>
              <th className="lg:w-30 md:w-25 h-10 w-10 border-r p-2 text-xs sm:w-20 xl:w-30 xl:text-sm">
                <span className="hidden sm:block md:block lg:block xl:block">
                  Perşembe
                </span>
                <span className="block sm:hidden md:hidden lg:hidden xl:hidden">
                  Per
                </span>
              </th>
              <th className="lg:w-30 md:w-25 h-10 w-10 border-r p-2 text-xs sm:w-20 xl:w-30 xl:text-sm">
                <span className="hidden sm:block md:block lg:block xl:block">
                  Cuma
                </span>
                <span className="block sm:hidden md:hidden lg:hidden xl:hidden">
                  Cum
                </span>
              </th>
              <th className="lg:w-30 md:w-25 h-10 w-10 border-r p-2 text-xs sm:w-20 xl:w-30 xl:text-sm">
                <span className="hidden sm:block md:block lg:block xl:block">
                  Cumartesi
                </span>
                <span className="block sm:hidden md:hidden lg:hidden xl:hidden">
                  Cum
                </span>
              </th>
              <th className="lg:w-30 md:w-25 h-10 w-10 border-r p-2 text-xs sm:w-20 xl:w-30 xl:text-sm">
                <span className="hidden sm:block md:block lg:block xl:block">
                  Pazar
                </span>
                <span className="block sm:hidden md:hidden lg:hidden xl:hidden">
                  Paz
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="h-20 text-center">
              {firstWeekDay !== 1 && renderFadedDays()}
              {Array.from({ length: 7 - firstWeekDay + 1 }).map((_, index) => {
                const day = firstDayOfWeek.add(index, "day").date();
                const isToday = dayjs().date() === day;

                const eventsData = events?.filter((item) => {
                  const itemDate = dayjs(item.date);

                  return (
                    dayjs(item.date).date() === day &&
                    dayjs(item.date).month() === currentMonth &&
                    dayjs(item.date).year() === currentYear
                  );
                });
                debugger;
                if (eventsData?.length) {
                  return (
                    <DayCard
                      key={day}
                      day={day}
                      events={eventsData}
                      isToday={isToday}
                      month={currentMonth + 1}
                      year={currentYear}
                    />
                  );
                }

                return (
                  <DayCard
                    key={day}
                    day={day}
                    month={currentMonth + 1}
                    year={currentYear}
                    isToday={isToday}
                  />
                );
              })}
            </tr>
            {/* Mid weeks  */}
            {Array.from({ length: midWeekLength }).map((_, week) => {
              const daysToAdd = 7 * (week + 1);
              return (
                <tr className="h-20 text-center" key={daysToAdd}>
                  {Array.from({ length: 7 }).map((_, dayNumber) => {
                    const day = getDay(dayNumber + 1, daysToAdd);
                    const isToday = dayjs().date() === day;
                    const eventsData = events?.filter(
                      (item) =>
                        dayjs(item.date).date() === day &&
                        dayjs(item.date).month() === currentMonth &&
                        dayjs(item.date).year() === currentYear
                    );
                    if (eventsData?.length) {
                      return (
                        <DayCard
                          key={day}
                          day={day}
                          events={eventsData}
                          isToday={isToday}
                          month={currentMonth + 1}
                          year={currentYear}
                        />
                      );
                    }

                    return (
                      <DayCard
                        key={day}
                        day={day}
                        isToday={isToday}
                        month={currentMonth + 1}
                        year={currentYear}
                      />
                    );
                  })}
                </tr>
              );
            })}
            {/* Last week */}
            <tr className="h-20 text-center">
              {renderLastWeekDays()}
              {renderNextMonthWeekDays()}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
