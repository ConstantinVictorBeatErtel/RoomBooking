import { format, parseISO } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { PST_TIMEZONE } from "./constants";

// Generate available times for a room based on avail_start and avail_end
export const generateAvailableTimes = (availStart, availEnd) => {
  if (!availStart || !availEnd) return [];

  const startTime = parseISO(availStart);
  const endTime = parseISO(availEnd);

  // Convert to PST and extract only the time components (discard date)
  const startPST = toZonedTime(startTime, PST_TIMEZONE);
  const endPST = toZonedTime(endTime, PST_TIMEZONE);

  // Create times using only the hour/minute from the availability timestamps
  const startHour = startPST.getHours();
  const endHour = endPST.getHours();

  const times = [];
  for (let hour = startHour; hour < endHour; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
    times.push(timeString);
  }

  return times;
};

// Format time for display (HH:MM AM/PM)
export const formatTimeForDisplay = (timeString) => {
  const [hours, minutes] = timeString.split(":");
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return format(date, "hh:mm aa");
};
