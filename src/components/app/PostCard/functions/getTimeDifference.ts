import dayjs from "dayjs";

type TimeUnit = "day" | "hour" | "minute" | "second";
type UnitLabels = { [key in TimeUnit]: string };

export const getTimeDifference = (date: Date) => {
  const units: TimeUnit[] = ["day", "hour", "minute", "second"];
  const unitLabels: UnitLabels = {
    day: "gün",
    hour: "saat",
    minute: "dakika",
    second: "saniye",
  };

  for (const unit of units) {
    const diff = dayjs().diff(dayjs(date), unit);
    if (diff > 0) {
      return `${diff} ${unitLabels[unit]} önce`;
    }
  }

  return "just now";
};
