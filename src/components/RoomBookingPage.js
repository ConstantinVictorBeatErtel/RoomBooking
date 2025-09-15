import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import RoomSelector from './booking/RoomSelector';
import DateTimeSelector from './booking/DateTimeSelector';
import BookingForm from './booking/BookingForm';

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
  const [selectedPersonId, setSelectedPersonId] = useState('');
  const [email, setEmail] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [people, setPeople] = useState([]);
  const [bookings, setBookings] = useState({});

  // Fetch rooms and people on component mount
  useEffect(() => {
    const fetchData = async() => {
      setLoading(true);
      try {
        // Fetch rooms
        const { data: roomsData, error: roomsError } = await supabase
          .from('rooms')
          .select('*');

        if (roomsError) throw roomsError;

        // Fetch people
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('*');

        if (peopleError) throw peopleError;

        setRooms(roomsData || []);
        setPeople(peopleData || []);

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
          .select('time_slot')
          .eq('date', dateString)
          .eq('room_id', selectedRoom);

        if (error) throw error;

        const bookedTimes = bookingsData.map(booking => booking.time_slot);
        const key = `${dateString}:${selectedRoom}`;
        setBookings(prev => ({ ...prev, [key]: bookedTimes }));
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [selectedDate, selectedRoom]);

  const handlePersonSelect = e => {
    const personId = e.target.value;
    setSelectedPersonId(personId);
    // Auto-populate email from selected person
    if (personId) {
      const selectedPerson = people.find(p => p.id === parseInt(personId));
      setEmail(selectedPerson ? selectedPerson.email : '');
    } else {
      setEmail('');
    }
  };

  const handleBookingSubmit = async e => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !selectedRoom || !selectedPersonId) {
      setBookingMessage('Please fill in all required fields.');
      return;
    }

    try {
      const bookingData = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        time_slot: selectedTime,
        room_id: selectedRoom,
        person_id: parseInt(selectedPersonId),
        email,
      };

      const { error } = await supabase.from('bookings').insert([bookingData]);

      if (error) throw error;

      // Update bookings state to reflect the new booking
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const bookingsKey = `${dateKey}:${selectedRoom}`;
      setBookings(prev => {
        const current = prev[bookingsKey] || [];
        const next = { ...prev, [bookingsKey]: [...current, selectedTime] };
        return next;
      });

      // Find selected person's name for confirmation message
      const selectedPerson = people.find(p => p.id === parseInt(selectedPersonId));
      const personName = selectedPerson ? selectedPerson.name : 'User';

      setBookingMessage(
        `Booking for ${personName} on ${selectedDate.toLocaleDateString()} at ${selectedTime} confirmed!`,
      );

      // Send email confirmation (await so errors are visible in logs)
      try {
        const response = await fetch('/api/send-booking-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: `Booking confirmed for ${format(selectedDate, 'PPP')} at ${formatTimeForDisplay(selectedTime)}`,
            html: `<p>Hi,</p><p>Your booking is confirmed for <strong>${format(selectedDate, 'PPP')}</strong> at <strong>${formatTimeForDisplay(selectedTime)}</strong>.</p>`
          })
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
        setSelectedPersonId('');
        setEmail('');
        setSelectedTime('');
        setBookingMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingMessage('Error creating booking. Please try again.');
    }


    

    return (
      <div className="container mx-auto p-4 max-w-4xl">
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
                people={people}
                selectedPersonId={selectedPersonId}
                onPersonSelect={handlePersonSelect}
                email={email}
                onEmailChange={(e) => setEmail(e.target.value)}
                onSubmit={handleBookingSubmit}
                bookingMessage={bookingMessage}
                loading={loading}
              />
            </div>

            {/* Booking Form Section */}
            <BookingForm
              people={people}
              selectedPersonId={selectedPersonId}
              onPersonSelect={handlePersonSelect}
              email={email}
              onEmailChange={e => setEmail(e.target.value)}
              onSubmit={handleBookingSubmit}
              bookingMessage={bookingMessage}
              loading={loading}
            />
          </div>
        </div>
      </div>
    );
  }
}
