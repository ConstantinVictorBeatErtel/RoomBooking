import { format, parse, isBefore } from 'date-fns';

export const validateBerkeleyEmail = email => {
  if (!email || typeof email !== 'string' || email.trim() === '') {
    // Throw an error for empty or invalid input
    throw new Error('Please provide an email address.');
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // More strict email format validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail) || trimmedEmail.includes('..')) {
    // Throw an error for general invalid formats
    throw new Error('Please enter a valid email format.');
  }
  
  // Check if it ends with @berkeley.edu
  if (!trimmedEmail.endsWith('@berkeley.edu')) {
    // Throw a specific error for the domain
    throw new Error('Email must be a valid @berkeley.edu address.');
  }

  // If all checks pass, the function simply completes.
};

/**
 * Gets the error message for email validation
 * @param {string} email - The email address to validate
 * @returns {string|null} - Error message if invalid, null if valid
 */
export const getBerkeleyEmailError = email => {
  if (!email || !email.trim()) {
    return 'Email is required';
  }
  
  if (!validateBerkeleyEmail(email)) {
    return 'Please use a Berkeley email address (someone@berkeley.edu)';
  }
  
  return null;
};

export const validateBooking = async({
  supabase,
  personId,
  roomId,
  date,
  startTime,
  duration,
}) => {
  const dateString = format(date, 'yyyy-MM-dd');
  const { data: existingBookings, error } = await supabase
    .from('bookings')
    .select('booking_time, duration_hours')
    .eq('person_id', personId)
    .eq('room_id', roomId)
    .eq('booking_date', dateString);

  if (error) throw error; // Re-throw database errors

  const selectedStartHour = parseInt(startTime.split(':')[0]);
  const selectedEndHour = selectedStartHour + duration;

  // Check if the booker has made adjacent bookings
  for (const booking of existingBookings) {
    const bookingStartHour = parseInt(booking.booking_time.split(':')[0]);
    const bookingEndHour = bookingStartHour + booking.duration_hours;

    const hasOverlap =
      (selectedStartHour < bookingEndHour &&
        selectedEndHour > bookingStartHour) ||
      selectedStartHour === bookingEndHour ||
      selectedEndHour === bookingStartHour;

    if (hasOverlap) {
      // Throw a new error
      throw new Error(
        'You already have a booking for this room at this time or an adjacent time.',
      );
    }
  }

  // Check if the booking is in the past
  const bookingDateTime = parse(`${dateString} ${startTime}`, 'yyyy-MM-dd HH:mm:ss', new Date());
  if (isBefore(bookingDateTime, new Date())) {
    throw new Error('Cannot make a booking in the past');
  }

  // If we get here, the booking is valid, so we do nothing.
};
