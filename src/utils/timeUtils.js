import { format } from 'date-fns';

// Generate available times for a room based on avail_start and avail_end
export const generateAvailableTimes = (availStart, availEnd, duration = 1, bookedTimes = []) => {
  // Always show 9am to 5pm regardless of room availability

  const times = [];
  // Always show 9am to 5pm (9 to 17) for available times
  const availableStartHour = 9;
  const availableEndHour = 17;
  
  for (let hour = availableStartHour; hour <= availableEndHour - duration; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
    
    // Check if this time slot is available for the given duration
    if (isTimeSlotAvailable(timeString, duration, bookedTimes)) {
      times.push(timeString);
    }
  }

  return times;
};

// Check if a time slot is available for a given duration
export const isTimeSlotAvailable = (startTime, duration, bookedTimes) => {
  const startHour = parseInt(startTime.split(':')[0]);
  const endHour = startHour + duration;
  
  // Check if any of the required hours are booked
  for (let hour = startHour; hour < endHour; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
    if (bookedTimes.includes(timeString)) {
      return false;
    }
  }
  
  return true;
};

// Get all time slots that would be occupied by a booking
export const getOccupiedTimeSlots = (startTime, duration) => {
  const startHour = parseInt(startTime.split(':')[0]);
  const occupiedSlots = [];
  
  for (let hour = startHour; hour < startHour + duration; hour++) {
    const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
    occupiedSlots.push(timeString);
  }
  
  return occupiedSlots;
};

// Format time for display (HH:MM AM/PM)
export const formatTimeForDisplay = timeString => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  return format(date, 'hh:mm aa');
};
