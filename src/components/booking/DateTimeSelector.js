import React from "react";
import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Button, Label, Calendar, Popover, PopoverTrigger, PopoverContent } from "../ui";
import { generateAvailableTimes, formatTimeForDisplay } from "../../utils/timeUtils";

const DateTimeSelector = ({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  rooms,
  selectedRoom,
  bookings,
}) => {
  // Get available times for selected room
  const selectedRoomData = rooms.find((room) => room.id === selectedRoom);
  const availableTimes = selectedRoomData
    ? generateAvailableTimes(
        selectedRoomData.avail_start,
        selectedRoomData.avail_end
      )
    : [];

  const dateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const bookingsKey =
    dateKey && selectedRoom ? `${dateKey}:${selectedRoom}` : null;
  const bookedTimesForDate =
    bookingsKey && bookings[bookingsKey] ? bookings[bookingsKey] : [];

  return (
    <>
      <div className="mb-6">
        <Label className="mb-3 block">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${
                !selectedDate ? "text-gray-500" : ""
              }`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                selectedDate.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar selected={selectedDate} onSelect={onDateSelect} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="mb-6">
        <Label className="mb-3 block flex items-center">
          <Clock className="mr-2 h-4 w-4" />
          Available Times
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {availableTimes.map((time) => {
            const isBooked = bookedTimesForDate.includes(time);
            return (
              <Button
                key={time}
                variant={selectedTime === time && !isBooked ? "default" : "outline"}
                onClick={() => !isBooked && onTimeSelect(time)}
                disabled={isBooked}
                className={`w-full ${
                  isBooked
                    ? "!bg-gray-200 !text-gray-500 !border-gray-300 !cursor-not-allowed !opacity-50 hover:!bg-gray-200 hover:!text-gray-500 hover:!border-gray-300"
                    : ""
                }`}
              >
                {formatTimeForDisplay(time)}
              </Button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DateTimeSelector;
