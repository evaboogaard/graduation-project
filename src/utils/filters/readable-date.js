import { DateTime } from "luxon";
import "dotenv/config";

export const readableDateFilter = (
  value,
  format = { month: "long", day: "numeric" },
) => {
  const dateObject = DateTime.fromISO(value);
  return dateObject.setLocale(process.env.LOCALE).toLocaleString(format);
};
