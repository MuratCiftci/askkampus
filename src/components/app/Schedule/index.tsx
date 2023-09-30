import React from "react";
import Style from "./index.module.css";
import Avatar from "~/components/shared/ui/Avatar";
import Badge from "~/components/shared/ui/Badge";
import dayjs from "dayjs";
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
        {[...Array(3)].map((_, index) => (
          <div className={Style.scheduleColumn} key={index}>
            <h3 className={Style.scheduleColumnTitle}>
              {index === 0
                ? dayjs().format("dddd, MMMM D")
                : index === 1
                ? dayjs().add(1, "day").format("dddd, MMMM D")
                : dayjs().add(2, "day").format("dddd, MMMM D")}
            </h3>
            <div className={Style.event}>
              <div className={Style.badge}>
                <Badge>10:00 AM</Badge>
              </div>
              <div className={Style.eventTitle}>
                 Gölbahçe Kahvaltı
              </div>
              <div className={Style.eventDescription}>
                <Avatar
                  size="small"
                  // random
                  src="https://picsum.photos/200"
                />
                <div className={Style.eventDescriptionText}>
                  <div className={Style.eventDescriptionTextTitle}>
                    Pamukkale Universitesi Bilgisayar 
                  </div>
                  <div className={Style.eventDescriptionTextDescription}>
                     Okulların açılmasıyla birlikte ilk kahvaltımızı yapmak için buluşuyoruz.
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;
