import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format, startOfWeek, addDays } from 'date-fns';
import RoomSelector from './booking/RoomSelector';
import DateTimeSelector from './booking/DateTimeSelector';
import BookingForm from './booking/BookingForm';
import { formatTimeForDisplay } from '../utils/timeUtils';
import { getBerkeleyEmailError } from '../utils/validation';
import BookingCalendar from './booking/BookingCalendar';

// Check if supabase client is initialized
if (!supabase) {
  console.error('Supabase client is not initialized');
} else {
  console.log('Supabase client is initialized');
}

export default function RoomBookingPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState({});
  const [bookingDetails, setBookingDetails] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());

  // Fetch rooms on component mount
  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        // Fetch rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*');

        if (roomsError) throw roomsError;

        setRooms(roomsData || []);

        // Set default room selection to first room
        if (roomsData && roomsData.length > 0) {
          setSelectedRoom(roomsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setBookingMessage('Error loading data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch bookings when date or room changes
  useEffect(() => {
    const fetchBookings = async() => {
      if (!selectedDate || !selectedRoom) return;

      try {
        // Grab existing bookings, including duration
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select('booking_time, duration_hours')
          .eq('booking_date', dateString)
          .eq('room_id', selectedRoom);

        if (error) throw error;

        // Get all occupied time slots (including duration)
        const occupiedSlots = new Set();
        bookingsData.forEach(booking => {
          const startHour = parseInt(booking.booking_time.split(':')[0]);
          for (let hour = startHour; hour < startHour + booking.duration_hours; hour++) {
            const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
            occupiedSlots.add(timeString);
          }
        });

        const key = `${dateString}:${selectedRoom}`;
        setBookings(prev => ({ ...prev, [key]: Array.from(occupiedSlots) }));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [selectedDate, selectedRoom]);

  // Fetch booking details for calendar view
  useEffect(() => {
    const fetchBookingDetails = async() => {
      try {
        // Get current week range for calendar
        const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
        const weekEnd = addDays(weekStart, 4); // Friday end
        
        const startDateString = format(weekStart, 'yyyy-MM-dd');
        const endDateString = format(weekEnd, 'yyyy-MM-dd');

        const { data: bookingDetailsData, error } = await supabase
          .from('bookings')
          .select(`
            id,
            booking_date,
            booking_time,
            duration_hours,
            room_id,
            person_id,
            person (name)
          `)
          .gte('booking_date', startDateString)
          .lte('booking_date', endDateString)
          .order('booking_date', { ascending: true })
          .order('booking_time', { ascending: true });

        if (error) throw error;

        // Transform the data to match the expected format
        const transformedBookings = bookingDetailsData.map(booking => ({
          id: booking.id,
          room_id: booking.room_id,
          person_name: booking.person?.name || 'Unknown',
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          duration_hours: booking.duration_hours,
        }));

        setBookingDetails(transformedBookings);
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    fetchBookingDetails();
  }, [currentWeek]);

  const handleBookingSubmit = async e => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedRoom || !name.trim() || !email.trim()) {
      setBookingMessage('Please fill in all required fields.');
      return;
    }

    // Validate Berkeley email
    const emailError = getBerkeleyEmailError(email);
    if (emailError) {
      setBookingMessage(emailError);
      return;
    }

    try {
      // First, check if person exists by email (since email is unique)
      let personId;
      const { data: existingPerson, error: searchError } = await supabase
        .from('person')
        .select('id, name')
        .eq('email', email.trim())
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned", other errors are actual problems
        throw searchError;
      }

      if (existingPerson) {
        // Person exists, use their ID
        personId = existingPerson.id;
        console.log(`Using existing person: ${existingPerson.name} (ID: ${personId})`);
        
        // GUARD: Check for back-to-back bookings by the same person
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const { data: existingBookings, error: bookingCheckError } = await supabase
          .from('bookings')
          .select('booking_time, duration_hours')
          .eq('person_id', personId)
          .eq('room_id', selectedRoom)
          .eq('booking_date', dateString);

        if (bookingCheckError) throw bookingCheckError;

        // GUARD: Check if this would create a back-to-back booking
        const selectedStartHour = parseInt(selectedTime.split(':')[0]);
        const selectedEndHour = selectedStartHour + selectedDuration;
        
        for (const booking of existingBookings) {
          const bookingStartHour = parseInt(booking.booking_time.split(':')[0]);
          const bookingEndHour = bookingStartHour + booking.duration_hours;
          
          // GUARD: Check for overlap or immediate adjacency
          if ((selectedStartHour < bookingEndHour && selectedEndHour > bookingStartHour) ||
              (selectedStartHour === bookingEndHour || selectedEndHour === bookingStartHour)) {
            setBookingMessage('You already have a booking for this room at this time or an adjacent time. Please choose a different time slot.');
            return;
          }
        }
      } else {
        // Person doesn't exist, create new person
        const { data: newPerson, error: createError } = await supabase
          .from('person')
          .insert([{ name: name.trim(), email: email.trim() }])
          .select('id')
          .single();

        if (createError) throw createError;
        
        personId = newPerson.id;
        console.log(`Created new person: ${name.trim()} (ID: ${personId})`);
      }

      // Now create the booking with the person_id and duration
      const bookingData = {
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
        duration_hours: selectedDuration,
        room_id: selectedRoom,
        person_id: personId,
      };

      const { error: bookingError } = await supabase.from('bookings').insert([bookingData]);

      if (bookingError) throw bookingError;

      // Update bookings state to reflect the new booking
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const bookingsKey = `${dateKey}:${selectedRoom}`;
      setBookings(prev => {
        const current = prev[bookingsKey] || [];
        // Add all occupied time slots for this booking
        const occupiedSlots = [];
        const startHour = parseInt(selectedTime.split(':')[0]);
        for (let hour = startHour; hour < startHour + selectedDuration; hour++) {
          const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
          occupiedSlots.push(timeString);
        }
        const next = { ...prev, [bookingsKey]: [...current, ...occupiedSlots] };
        return next;
      });

      // Also update booking details for calendar
      setBookingDetails(prev => [
        ...prev,
        {
          id: Date.now(), // Temporary ID until we get the real one
          room_id: selectedRoom,
          person_name: name.trim(),
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          booking_time: selectedTime,
          duration_hours: selectedDuration,
        },
      ]);

      setBookingMessage(
        `Booking for ${name.trim()} on ${selectedDate.toLocaleDateString()} at ${selectedTime} for ${selectedDuration} hour${selectedDuration > 1 ? 's' : ''} confirmed!`,
      );

      // Send email confirmation (await so errors are visible in logs)
      try {
        const response = await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email.trim(),
            subject: `Booking confirmed for ${format(selectedDate, 'PPP')} at ${formatTimeForDisplay(selectedTime)} (${selectedDuration}h)`,
            html: `<p>Hi ${name.trim()},</p><p>Your booking is confirmed for <strong>${format(selectedDate, 'PPP')}</strong> at <strong>${formatTimeForDisplay(selectedTime)}</strong> for <strong>${selectedDuration} hour${selectedDuration > 1 ? 's' : ''}</strong>.</p>`,
          }),
        });
        const json = await response.json().catch(() => ({}));
        if (!response.ok) {
          console.error('Email send failed', json);
        }
      } catch (err) {
        console.error('Email send request error', err);
      }

      // Optionally reset form fields after successful submission
      setTimeout(() => {
        setName('');
        setEmail('');
        setSelectedTime('');
        setSelectedDuration(1);
        setBookingMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingMessage('Error creating booking. Please try again.');
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-brand-blue text-white p-8 shadow-md">
          <h1 className="text-3xl font-bold text-center">Book a Room</h1>
          <p className="text-center text-white mt-2">
            Select your preferred date and time
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar and Time Selection Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
                <CalendarIcon className="mr-2 h-6 w-6" />
                Select Date & Time
              </h2>

              <DateTimeSelector
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                selectedTime={selectedTime}
                onTimeSelect={setSelectedTime}
                selectedDuration={selectedDuration}
                onDurationChange={setSelectedDuration}
                rooms={rooms}
                selectedRoom={selectedRoom}
                bookings={bookings}
              />

              <RoomSelector
                rooms={rooms}
                selectedRoom={selectedRoom}
                onRoomSelect={setSelectedRoom}
                loading={loading}
              />
            </div>

            {/* Calendar View */}
            <div className="mt-8">
              <BookingCalendar
                rooms={rooms}
                bookingDetails={bookingDetails}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                currentWeek={currentWeek}
                onWeekChange={setCurrentWeek}
              />
            </div>

            {/* Booking Form Section */}
            <BookingForm
              name={name}
              onNameChange={e => setName(e.target.value)}
              email={email}
              onEmailChange={e => setEmail(e.target.value)}
              onSubmit={handleBookingSubmit}
              bookingMessage={bookingMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
