import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import RoomSelector from './booking/RoomSelector';
import DateTimeSelector from './booking/DateTimeSelector';
import BookingForm from './booking/BookingForm';
import BookingCalendar from './booking/BookingCalendar';
// import { formatTimeForDisplay } from '../utils/timeUtils';
import { getBerkeleyEmailError } from '../utils/validation';

// Mock data for testing without Supabase
const mockRooms = [
  {
    id: 1,
    name: 'Hearst Huddle Room',
    capacity: 4,
    avail_start: '2024-01-01T09:00:00Z',
    avail_end: '2024-01-01T17:00:00Z',
    description: 'Cozy meeting room with whiteboard and video conferencing.',
    color: '#4285f4', // Google Blue
  },
  {
    id: 2,
    name: 'Coach Corner',
    capacity: 4,
    avail_start: '2024-01-01T09:00:00Z',
    avail_end: '2024-01-01T17:00:00Z',
    description: 'Private corner space ideal for coaching sessions.',
    color: '#34a853', // Google Green
  },
  {
    id: 3,
    name: 'Founders Conference Room',
    capacity: 8,
    avail_start: '2024-01-01T09:00:00Z',
    avail_end: '2024-01-01T17:00:00Z',
    description: 'Executive conference room with large display and premium amenities.',
    color: '#ea4335', // Google Red
  },
  {
    id: 4,
    name: 'Common Area Table',
    capacity: 8,
    avail_start: '2024-01-01T09:00:00Z',
    avail_end: '2024-01-01T17:00:00Z',
    description: 'Open collaborative workspace near kitchen facilities.',
    color: '#fbbc04', // Google Yellow
  },
];

const mockBookings = {
  '2024-01-15:1': ['10:00:00', '11:00:00'], // Room 1 has 10-11am booked
  '2024-01-15:2': ['14:00:00', '15:00:00', '16:00:00'], // Room 2 has 2-4pm booked (2 hours)
};

const mockBookingDetails = [
  {
    id: 1,
    room_id: 1,
    person_name: 'John Doe',
    booking_date: '2024-01-15',
    booking_time: '10:00:00',
    duration_hours: 1,
  },
  {
    id: 2,
    room_id: 2,
    person_name: 'Jane Smith',
    booking_date: '2024-01-15',
    booking_time: '14:00:00',
    duration_hours: 2,
  },
  {
    id: 3,
    room_id: 3,
    person_name: 'Bob Johnson',
    booking_date: '2024-01-15',
    booking_time: '09:00:00',
    duration_hours: 2,
  },
  {
    id: 4,
    room_id: 4,
    person_name: 'Alice Brown',
    booking_date: '2024-01-15',
    booking_time: '11:00:00',
    duration_hours: 1,
  },
  {
    id: 5,
    room_id: 1,
    person_name: 'Charlie Wilson',
    booking_date: '2024-01-16',
    booking_time: '09:00:00',
    duration_hours: 2,
  },
  {
    id: 6,
    room_id: 2,
    person_name: 'Diana Prince',
    booking_date: '2024-01-16',
    booking_time: '11:00:00',
    duration_hours: 1,
  },
  {
    id: 7,
    room_id: 3,
    person_name: 'Eve Adams',
    booking_date: '2024-01-16',
    booking_time: '14:00:00',
    duration_hours: 3,
  },
  {
    id: 8,
    room_id: 4,
    person_name: 'Frank Miller',
    booking_date: '2024-01-16',
    booking_time: '16:00:00',
    duration_hours: 2,
  },
];

export default function RoomBookingPageMock() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [loading] = useState(false);
  const [rooms] = useState(mockRooms);
  const [bookings, setBookings] = useState(mockBookings);
  const [bookingDetails] = useState(mockBookingDetails);

  // Set default room selection to first room
  useEffect(() => {
    if (rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(rooms[0].id);
    }
  }, [rooms, selectedRoom]);

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
      // Simulate person lookup/creation
      const personId = Math.random().toString(36).substr(2, 9);
      
      // Check for back-to-back bookings by the same person (simplified for mock)
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const bookingsKey = `${dateString}:${selectedRoom}`;
      const existingBookings = bookings[bookingsKey] || [];
      
      // Check if this would create a back-to-back booking
      const selectedStartHour = parseInt(selectedTime.split(':')[0]);
      const selectedEndHour = selectedStartHour + selectedDuration;
      
      for (const bookedTime of existingBookings) {
        const bookedStartHour = parseInt(bookedTime.split(':')[0]);
        const bookedEndHour = bookedStartHour + 1; // Assume 1 hour for existing bookings
        
        // Check for overlap or immediate adjacency
        if ((selectedStartHour < bookedEndHour && selectedEndHour > bookedStartHour) ||
            (selectedStartHour === bookedEndHour || selectedEndHour === bookedStartHour)) {
          setBookingMessage('This time slot conflicts with an existing booking. Please choose a different time.');
          return;
        }
      }

      // Simulate successful booking
      console.log('Mock booking created:', {
        personId,
        roomId: selectedRoom,
        date: dateString,
        time: selectedTime,
        duration: selectedDuration,
        name: name.trim(),
        email: email.trim(),
      });

      // Update bookings state to reflect the new booking
      setBookings(prev => {
        const current = prev[bookingsKey] || [];
        // Add all occupied time slots for this booking
        const occupiedSlots = [];
        for (let hour = selectedStartHour; hour < selectedEndHour; hour++) {
          const timeString = `${hour.toString().padStart(2, '0')}:00:00`;
          occupiedSlots.push(timeString);
        }
        const next = { ...prev, [bookingsKey]: [...current, ...occupiedSlots] };
        return next;
      });

      setBookingMessage(
        `Mock booking for ${name.trim()} on ${selectedDate.toLocaleDateString()} at ${selectedTime} for ${selectedDuration} hour${selectedDuration > 1 ? 's' : ''} confirmed!`,
      );

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
          <div className="text-center">
            <h2 className="text-3xl font-bold text-yellow-400 mb-2">Berkeley Master of Analytics - Blum Hall</h2>
            <h1 className="text-3xl font-bold">Book a Room</h1>
            <p className="text-center text-white mt-2">
              Select your preferred date and time
            </p>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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

              {/* Calendar View */}
              <div className="mt-8">
                <BookingCalendar
                  rooms={rooms}
                  bookingDetails={bookingDetails}
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
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
