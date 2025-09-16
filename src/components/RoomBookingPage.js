import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import RoomSelector from './booking/RoomSelector';
import DateTimeSelector from './booking/DateTimeSelector';
import BookingForm from './booking/BookingForm';
import { formatTimeForDisplay } from '../utils/timeUtils';
import { getBerkeleyEmailError } from '../utils/validation';

// Check if supabase client is initialized
if (!supabase) {
  console.error('Supabase client is not initialized');
} else {
  console.log('Supabase client is initialized');
}

export default function RoomBookingPage() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState({});

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
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        const { data: bookingsData, error } = await supabase
          .from('bookings')
          .select('booking_time')
          .eq('booking_date', dateString)
          .eq('room_id', selectedRoom);

        if (error) throw error;

        const bookedTimes = bookingsData.map(booking => booking.booking_time);
        const key = `${dateString}:${selectedRoom}`;
        setBookings(prev => ({ ...prev, [key]: bookedTimes }));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [selectedDate, selectedRoom]);

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

      // Now create the booking with the person_id
      const bookingData = {
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
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
        const next = { ...prev, [bookingsKey]: [...current, selectedTime] };
        return next;
      });

      setBookingMessage(
        `Booking for ${name.trim()} on ${selectedDate.toLocaleDateString()} at ${selectedTime} confirmed!`,
      );

      // Send email confirmation (await so errors are visible in logs)
      try {
        const response = await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email.trim(),
            subject: `Booking confirmed for ${format(selectedDate, 'PPP')} at ${formatTimeForDisplay(selectedTime)}`,
            html: `<p>Hi ${name.trim()},</p><p>Your booking is confirmed for <strong>${format(selectedDate, 'PPP')}</strong> at <strong>${formatTimeForDisplay(selectedTime)}</strong>.</p>`,
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h1 className="text-3xl font-bold text-center">Book a Room</h1>
          <p className="text-center text-blue-100 mt-2">
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
