import { useState, useEffect, useCallback } from 'react';
import { Info, Trash2 } from 'lucide-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  parseISO,
  setSeconds,
  setMinutes,
  setHours,
  isBefore,
} from 'date-fns';
import clsx from 'clsx';

const BookingCalendar = ({
  rooms,
  bookingDetails,
  currentWeek,
  onWeekChange,
  selectedRoomId,
  pendingSelection,
  onPendingSelectionClear,
  onTimeSelect,
  currentUserEmail,
  onDeleteBooking,
}) => {
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
  const weekDays = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)); // Monday to Friday only

  const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 9 PM

  // Drag selection state
  const [isDragging, setIsDragging] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);

  // Filter bookings if single room view is active
  const filteredBookingDetails = selectedRoomId
    ? bookingDetails.filter(booking => booking.room_id === selectedRoomId)
    : bookingDetails;

  // function for checking if the slot is in the past
  function isSlotInPast(date, hour) {
    const slotDateTime = setSeconds(setMinutes(setHours(new Date(date), hour), 0), 0);
    return isBefore(slotDateTime, new Date());
  }

  // Create lane mapping: sort rooms alphabetically and assign lane index
  const getRoomLane = roomId => {
    const sortedRooms = [...rooms].sort((a, b) => a.name.localeCompare(b.name));
    return sortedRooms.findIndex(room => room.id === roomId);
  };

  const getBookingsForDate = date => {
    const dateString = format(date, 'yyyy-MM-dd');
    return filteredBookingDetails.filter(
      booking => booking.booking_date === dateString,
    );
  };

  const getBookingsForTimeSlot = (date, hour) => {
    const dateBookings = getBookingsForDate(date);
    return dateBookings.filter(booking => {
      const bookingHour = parseInt(booking.booking_time.split(':')[0]);
      return bookingHour <= hour && hour < bookingHour + booking.duration_hours;
    });
  };

  // Return tailwind class names
  const getRoomColor = roomId => {
    const colorMap = {
      1: 'bg-room-blue',
      2: 'bg-room-green',
      3: 'bg-room-red',
      4: 'bg-room-yellow',
    };
    const colors = [
      'bg-room-blue',
      'bg-room-green',
      'bg-room-red',
      'bg-room-yellow',
    ];
    return colorMap[roomId] || colors[(roomId - 1) % colors.length];
  };

  const getRoomColorHex = roomId => {
    const colorMap = {
      1: '#4285f4',
      2: '#34a853',
      3: '#ea4335',
      4: '#fbbc04',
    };
    const colors = ['#4285f4', '#34a853', '#ea4335', '#fbbc04'];
    return colorMap[roomId] || colors[(roomId - 1) % colors.length];
  };

  const navigateWeek = direction => {
    onWeekChange(
      direction === 'prev' ? subWeeks(currentWeek, 1) : addWeeks(currentWeek, 1),
    );
  };

  // Check if a time slot is occupied
  const isSlotOccupied = (date, hour) => {
    const bookings = getBookingsForTimeSlot(date, hour);
    return bookings.length > 0;
  };

  // Check if slot is in selection range (either dragging or pending)
  const isInSelection = (date, hour) => {
    // Check active drag selection
    if (isDragging && selectionStart && selectionEnd) {
      if (isSameDay(date, selectionStart.date)) {
        const minHour = Math.min(selectionStart.hour, selectionEnd.hour);
        const maxHour = Math.max(selectionStart.hour, selectionEnd.hour);
        if (hour >= minHour && hour <= maxHour) return true;
      }
    }
    
    // Check pending selection
    if (pendingSelection && selectedRoomId === pendingSelection.roomId) {
      const selectionDate = parseISO(pendingSelection.date);
      if (isSameDay(date, selectionDate)) {
        const startHour = parseInt(pendingSelection.startTime.split(':')[0]);
        const endHour = parseInt(pendingSelection.endTime.split(':')[0]) - 1;
        return hour >= startHour && hour <= endHour;
      }
    }
    
    return false;
  };

  // Mouse handlers for drag selection
  const handleMouseDown = (date, hour) => {
    if (!selectedRoomId) return; // Only in single room view
    if (isSlotOccupied(date, hour)) return; // Can't start on occupied slot

    if (isSlotInPast(date, hour)) return;
    
    // Clear any pending selection when starting new drag
    if (onPendingSelectionClear) {
      onPendingSelectionClear();
    }
    
    setIsDragging(true);
    setSelectionStart({ date, hour });
    setSelectionEnd({ date, hour });
  };

  const handleMouseEnter = (date, hour) => {
    if (!isDragging || !selectionStart) return;
    if (!isSameDay(date, selectionStart.date)) return; // Same day only

    // Check if we hit an occupied slot
    const direction = hour > selectionStart.hour ? 1 : -1;
    const currentHour = selectionEnd?.hour ?? selectionStart.hour;

    // Moving to new hour
    if (direction > 0) {
      // Moving down - check all slots between current and target
      for (let h = currentHour + 1; h <= hour; h++) {
        if (isSlotOccupied(date, h)) {
          // Hit a wall, stop at the slot before
          setSelectionEnd({ date, hour: h - 1 });
          return;
        }
      }
      // Enforce 3-hour maximum
      const maxHour = selectionStart.hour + 2; // +2 because we want 3 hours total (start hour + 2 more)
      if (hour > maxHour) {
        setSelectionEnd({ date, hour: maxHour });
        return;
      }
    } else {
      // Moving up - check all slots between target and current
      for (let h = hour; h < currentHour; h++) {
        if (isSlotOccupied(date, h)) {
          // Hit a wall, stop at the slot after
          setSelectionEnd({ date, hour: h + 1 });
          return;
        }
      }
      // Enforce 3-hour maximum when dragging upward
      const minHour = selectionStart.hour - 2; // -2 because we want 3 hours total
      if (hour < minHour) {
        setSelectionEnd({ date, hour: minHour });
        return;
      }
    }

    setSelectionEnd({ date, hour });
  };

  const handleMouseUp = useCallback(() => {
    if (!isDragging || !selectionStart || !selectionEnd) return;
    
    const minHour = Math.min(selectionStart.hour, selectionEnd.hour);
    const maxHour = Math.max(selectionStart.hour, selectionEnd.hour);
    const duration = maxHour - minHour + 1;
    
    // Validate minimum 1 hour
    if (duration >= 1) {
      const startTime = `${minHour.toString().padStart(2, '0')}:00:00`;
      const endTime = `${(maxHour + 1).toString().padStart(2, '0')}:00:00`;
      
      if (onTimeSelect) {
        onTimeSelect({
          roomId: selectedRoomId,
          date: format(selectionStart.date, 'yyyy-MM-dd'),
          startTime,
          endTime,
          duration,
        });
      }

    }
    
    // Reset drag state
    setIsDragging(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isDragging, selectionStart, selectionEnd, selectedRoomId, onTimeSelect]);

  // Global mouse up handler
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      return () => document.removeEventListener('mouseup', handleMouseUp);
    }
  }, [isDragging, handleMouseUp]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 w-full">
      {/* Header section */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold mb-6 text-gray-700">
          Room Availability
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm font-medium text-gray-600 min-w-[120px] text-center">
            {format(weekStart, 'MMM d')} -{' '}
            {format(addDays(weekStart, 4), 'MMM d, yyyy')}
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
        <div className="grid grid-cols-6 gap-px bg-gray-200 rounded-t-lg">
          <div className="bg-gray-50 p-3 text-center text-sm font-medium text-gray-500">
            Time
          </div>
          {weekDays.map(day => (
            <div
              key={day.toISOString()}
              className={clsx(
                'p-3 text-center text-sm font-medium',
                isToday(day)
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-gray-50 text-gray-700',
              )}
            >
              <div className="text-xs text-gray-500">{format(day, 'EEE')}</div>
              <div className="text-lg">{format(day, 'd')}</div>
            </div>
          ))}
        </div>

        {/* Time slots and bookings */}
        <div className="grid grid-cols-6 gap-px bg-gray-200 rounded-b-lg">
          <div className="bg-gray-50">
            {hours.map(hour => (
              <div
                key={hour}
                className="h-12 flex items-center justify-center text-xs text-gray-500 border-b border-gray-200"
              >
                {hour === 12
                  ? '12 PM'
                  : hour > 12
                    ? `${hour - 12} PM`
                    : `${hour} AM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map(day => (
            <div key={day.toISOString()} className="bg-white">
              {hours.map(hour => {
                const bookings = getBookingsForTimeSlot(day, hour);
                // const isSelected = selectedDate && isSameDay(day, selectedDate);

                const inSelection = isInSelection(day, hour);
                const slotOccupied = isSlotOccupied(day, hour);

                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className={clsx(
                      'h-12 border-b border-gray-200 relative',
                      // if the slot is in the past: always gray out, gray text, show not-allowed
                      isSlotInPast(day, hour)
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        // if a room is selected and the slot isn't occupied, point and hover
                        : selectedRoomId && !slotOccupied
                          ? 'cursor-pointer hover:bg-gray-50'
                          // else, default
                          : 'cursor-default',
                    )}
                    style={{
                      backgroundColor:
                        inSelection && selectedRoomId
                          ? `${getRoomColorHex(selectedRoomId)}33`
                          : undefined,
                    }}
                    onMouseDown={() => handleMouseDown(day, hour)}
                    onMouseEnter={() => handleMouseEnter(day, hour)}
                    onMouseUp={handleMouseUp}
                  >
                    {bookings.map(booking => {
                      const isFirstHour =
                        parseInt(booking.booking_time.split(':')[0]) === hour;
                      if (!isFirstHour) return null;

                      // Single-room view: wide pill with person name
                      if (selectedRoomId) {
                        const isOwnBooking = currentUserEmail && booking.person_email === currentUserEmail;
                        return (
                          <div
                            key={booking.id}
                            className={clsx(
                              'absolute rounded shadow-sm text-white font-medium',
                              'flex items-center justify-between text-xs px-2',
                              getRoomColor(booking.room_id),
                            )}
                            style={{
                              top: '2px',
                              left: '0',
                              width: 'calc(100% - 2px)',
                              height: `${booking.duration_hours * 48 - 4}px`,
                              zIndex: 10,
                            }}
                          >
                            <span className="truncate">
                              {booking.person_name}
                            </span>
                            {isOwnBooking && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  if (window.confirm('Are you sure you want to delete this booking?')) {
                                    onDeleteBooking(booking.id);
                                  }
                                }}
                                className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
                                title="Delete booking"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        );
                      }

                      // All rooms view: narrow pills with fixed lanes
                      const laneIndex = getRoomLane(booking.room_id);
                      const totalRooms = rooms.length;
                      const laneWidthPercent = 100 / totalRooms;
                      const gapPx = 2;
                      const isOwnBooking = currentUserEmail && booking.person_email === currentUserEmail;

                      return (
                        <div
                          key={booking.id}
                          className={clsx(
                            'absolute rounded shadow-sm text-white flex items-center justify-center',
                            getRoomColor(booking.room_id),
                          )}
                          style={{
                            top: '2px',
                            left: `calc(${laneWidthPercent * laneIndex}%)`,
                            width: `calc(${laneWidthPercent}% - ${gapPx}px)`,
                            height: `${booking.duration_hours * 48 - 4}px`,
                            zIndex: 10,
                          }}
                        >
                          {isOwnBooking && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                if (window.confirm('Are you sure you want to delete this booking?')) {
                                  onDeleteBooking(booking.id);
                                }
                              }}
                              className="p-1 hover:bg-white/20 rounded transition-colors"
                              title="Delete booking"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
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

      {/* Legend / Prompt Section */}
      <div className="mt-4 flex items-center text-sm text-gray-600">
        {!selectedRoomId ? (
          // "All Rooms" view: Show the color legend
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {rooms.map(room => (
              <div key={room.id} className="flex items-center space-x-2">
                <div
                  className={clsx('w-4 h-4 rounded', getRoomColor(room.id))}
                />
                <span>{room.name}</span>
              </div>
            ))}
          </div>
        ) : (
          // "Single Room" view: Show the drag prompt
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-gray-500" />
            <span className="italic">
              Drag within the calendar to choose your time slot
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingCalendar;
