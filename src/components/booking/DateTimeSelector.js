import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import {
  Button,
  Calendar,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../ui';
import {
  generateAvailableTimes,
  formatTimeForDisplay,
} from '../../utils/timeUtils';
import DurationSelector from './DurationSelector';
import clsx from 'clsx';

const DateTimeSelector = ({
  selectedDate,
  onDateSelect,
  selectedTime,
  onTimeSelect,
  selectedDuration,
  onDurationChange,
  rooms,
  selectedRoom,
  bookings,
}) => {
  const selectedRoomData = rooms.find(room => room.id === selectedRoom);
  const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
  const bookingsKey =
    dateKey && selectedRoom ? `${dateKey}:${selectedRoom}` : null;
  const bookedTimesForDate =
    bookingsKey && bookings[bookingsKey] ? bookings[bookingsKey] : [];
  
  const availableTimes = selectedRoomData
    ? generateAvailableTimes(
      selectedRoomData.avail_start,
      selectedRoomData.avail_end,
      selectedDuration,
      bookedTimesForDate,
    )
    : [];

  return (
    <>
      <div className="mb-6">
        {/* Themed Date Label */}
        <label className="block text-base font-semibold text-neutral-dark mb-3">
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            {/* Themed Date Picker Button */}
            <Button
              variant="outline"
              className={clsx(
                'block text-base font-semibold text-neutral-dark mb-3 flex items-center',
                !selectedDate && 'text-neutral-dark',
              )}
            >
              <CalendarIcon className="mr-2 h-5 w-5" />
              {selectedDate ? (
                selectedDate.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
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

      <DurationSelector
        selectedDuration={selectedDuration}
        onDurationChange={onDurationChange}
      />

      <div className="mb-6">
        {/* Themed "Available Times" Label */}
        <label className="block text-base font-semibold text-neutral-dark mb-3 flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          Available Times
        </label>
        <div className="grid grid-cols-3 gap-2">
          {availableTimes.map(time => {
            const isBooked = bookedTimesForDate.includes(time);
            const isSelected = selectedTime === time && !isBooked;

            return (
              // Use <button> and clsx for precise styling
              <button
                key={time}
                onClick={() => onTimeSelect(time)}
                disabled={isBooked}
                className={clsx(
                  // Base styles
                  clsx(
                    'w-full rounded-lg border p-3 text-sm font-medium transition-colors',
                    'duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue',
                  ),
                  {
                    // Disabled (Booked) State
                    'bg-neutral-lightest text-neutral-medium border-transparent cursor-not-allowed':
                      isBooked,
                    // Selected State
                    'bg-brand-blue border-brand-blue text-white': isSelected,
                    // Default/Unselected State
                    'bg-white border-neutral-light text-neutral-dark hover:bg-neutral-lightest':
                      !isSelected && !isBooked,
                  },
                )}
              >
                <div className="text-center">
                  <div>{formatTimeForDisplay(time)}</div>
                  <div className="text-xs opacity-75">
                    ({selectedDuration}h)
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default DateTimeSelector;
