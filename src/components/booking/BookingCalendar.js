import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, isToday } from 'date-fns';
import clsx from 'clsx';

const BookingCalendar = ({ rooms, bookingDetails, selectedDate, onDateSelect }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)); // Monday to Friday only

  const hours = Array.from({ length: 8 }, (_, i) => i + 9); // 9 AM to 4 PM

  const getBookingsForDate = date => {
    const dateString = format(date, 'yyyy-MM-dd');
    return bookingDetails.filter(booking => booking.booking_date === dateString);
  };

  const getBookingsForTimeSlot = (date, hour) => {
    const dateBookings = getBookingsForDate(date);
    return dateBookings.filter(booking => {
      const bookingHour = parseInt(booking.booking_time.split(':')[0]);
      return bookingHour <= hour && hour < bookingHour + booking.duration_hours;
    });
  };

  const getRoomColor = roomId => {
    const room = rooms.find(r => r.id === roomId);
    return room?.color || '#6b7280';
  };

  const navigateWeek = direction => {
    if (direction === 'prev') {
      setCurrentWeek(prev => subWeeks(prev, 1));
    } else {
      setCurrentWeek(prev => addWeeks(prev, 1));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Room Booking Calendar</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-600 min-w-[120px] text-center">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 4), 'MMM d, yyyy')}
          </span>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full">
        <div className="w-full">
          {/* Header with days */}
          <div className="grid grid-cols-6 gap-px bg-gray-200 rounded-t-lg">
            <div className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-500">
              Time
            </div>
            {weekDays.map(day => (
              <div
                key={day.toISOString()}
                className={clsx(
                  'p-3 text-center text-sm font-medium',
                  isToday(day) ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-700',
                )}
              >
                <div className="text-xs text-gray-500">
                  {format(day, 'EEE')}
                </div>
                <div className="text-lg">
                  {format(day, 'd')}
                </div>
              </div>
            ))}
          </div>

          {/* Time slots and bookings */}
          <div className="grid grid-cols-6 gap-px bg-gray-200 rounded-b-lg">
            {/* Time column */}
            <div className="bg-gray-50">
              {hours.map(hour => (
                <div
                  key={hour}
                  className="h-10 flex items-center justify-center text-xs text-gray-500 border-b border-gray-200"
                >
                  {hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
              ))}
            </div>

            {/* Day columns */}
            {weekDays.map(day => (
              <div key={day.toISOString()} className="bg-white">
                {hours.map(hour => {
                  const bookings = getBookingsForTimeSlot(day, hour);
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  
                  return (
                    <div
                      key={`${day.toISOString()}-${hour}`}
                      className={clsx(
                        'h-10 border-b border-gray-200 relative cursor-pointer hover:bg-gray-50',
                        isSelected && 'bg-blue-50',
                      )}
                      onClick={() => onDateSelect(day)}
                    >
                      {bookings.map((booking, _index) => {
                        const room = rooms.find(r => r.id === booking.room_id);
                        const isFirstHour = parseInt(booking.booking_time.split(':')[0]) === hour;
                        
                        if (!isFirstHour) return null;

                        return (
                          <div
                            key={booking.id}
                            className={clsx(
                              'absolute inset-0.5 rounded text-xs p-0.5 overflow-hidden',
                              'text-white font-medium shadow-sm',
                            )}
                            style={{
                              backgroundColor: getRoomColor(booking.room_id),
                              height: `${booking.duration_hours * 40 - 1}px`, // 40px per hour
                              zIndex: 10,
                            }}
                          >
                            <div className="truncate text-xs">
                              {room?.name}
                            </div>
                            <div className="truncate text-xs opacity-90">
                              {booking.person_name}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {rooms.map(room => (
          <div key={room.id} className="flex items-center space-x-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: room.color }}
            />
            <span className="text-sm text-gray-600">{room.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingCalendar;
