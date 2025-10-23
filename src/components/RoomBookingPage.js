import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { format, startOfWeek, addDays, parseISO } from 'date-fns';
import RoomSelector from './booking/RoomSelector';
import BookingForm from './booking/BookingForm';
import { validateBerkeleyEmail, validateBooking } from '../utils/validation';
import BookingCalendar from './booking/BookingCalendar';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from './auth/AuthForm';
import { Button } from './ui';
import { LogOut } from 'lucide-react';

// Check if supabase client is initialized
if (!supabase) {
  console.error('Supabase client is not initialized');
} else {
  console.log('Supabase client is initialized');
}

export default function RoomBookingPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [pendingSelection, setPendingSelection] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [bookingDetails, setBookingDetails] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('idle'); 

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
      } catch (error) {
        console.error('Error fetching data:', error);
        setBookingMessage('Error loading data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // fetch booking details for calendar view
  const fetchBookingDetails = useCallback(async() => {
    try {
      // Get current week range for calendar
      const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 }); // Monday start
      const weekEnd = addDays(weekStart, 4); // Friday end

      const startDateString = format(weekStart, 'yyyy-MM-dd');
      const endDateString = format(weekEnd, 'yyyy-MM-dd');

      const { data: bookingDetailsData, error } = await supabase
        .from('bookings')
        .select(
          `
          id,
          booking_date,
          booking_time,
          duration_hours,
          room_id,
          person_id,
          person (name)
        `,
        )
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
        person_id: booking.person_id,
      }));

      setBookingDetails(transformedBookings);
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  }, [currentWeek]);

  // aaaand actually fetch the bookings
  useEffect(() => {
    fetchBookingDetails();
  }, [fetchBookingDetails]);

  // Handle booking deletion
  const handleDeleteBooking = async bookingId => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      // Refresh bookings after successful deletion
      fetchBookingDetails();
      setBookingMessage('Booking deleted successfully');
      setTimeout(() => setBookingMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setBookingMessage(error.message || 'Failed to delete booking');
    }
  };

  // what happens when we hit submit?
  const handleBookingSubmit = async e => {
    e.preventDefault();

    // Guard: Only proceed if pendingSelection exists
    if (!pendingSelection) return;

    setBookingStatus('loading');
    setBookingMessage('');

    try {
      // Use authenticated user's email
      const userEmail = user.email;

      // Use pendingSelection exclusively
      const bookingDate = parseISO(pendingSelection.date);
      const bookingTime = pendingSelection.startTime;
      const bookingDuration = pendingSelection.duration;
      const bookingRoom = pendingSelection.roomId;

      if (!userEmail) {
        throw new Error('User email not found. Please sign in again.');
      }

      // validate Berkeley email
      validateBerkeleyEmail(userEmail);

      // grab the person's ID or create person record
      let personId;
      const { data: existingPerson, error: searchError } = await supabase
        .from('person')
        .select('id, name')
        .eq('email', userEmail)
        .single();

      if (searchError && searchError.code !== 'PGRST116') {
        // PGRST116 is "no rows returned", other errors are actual problems
        throw searchError;
      }

      if (existingPerson) {
        // Person exists, use their ID
        personId = existingPerson.id;
      } else {
        // Person doesn't exist, create new person with email as name (can be updated later)
        const { data: newPerson, error: createError } = await supabase
          .from('person')
          .insert([{ name: userEmail.split('@')[0], email: userEmail }])
          .select('id')
          .single();

        if (createError) throw createError;

        personId = newPerson.id;
      }
      
      // Validate the booking
      await validateBooking({
        supabase,
        personId,
        roomId: pendingSelection.roomId,
        date: bookingDate,
        startTime: pendingSelection.startTime,
        duration: pendingSelection.duration,
      });

      // Now create the booking with the person_id and duration
      const bookingData = {
        booking_date: format(bookingDate, 'yyyy-MM-dd'),
        booking_time: bookingTime,
        duration_hours: bookingDuration,
        room_id: bookingRoom,
        person_id: personId,
      };

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([bookingData]);

      if (bookingError) throw bookingError;

      setBookingStatus('confirmed');
      await new Promise(resolve => setTimeout(resolve, 2500)); // for animation

      // refresh everything
      setPendingSelection(null);
      setIsFormVisible(false);
      setBookingStatus('idle');
      fetchBookingDetails();
    } catch (error) {
      console.error('Error creating booking:', error);
      setBookingMessage(error.message);
      setBookingStatus('idle');
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="w-full mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <p className="text-center text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if user is not logged in
  if (!user) {
    return (
      <div className="w-full mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-brand-blue text-white p-8 shadow-md">
            <h1 className="text-3xl font-bold text-center">
              Blum Hall Room Booker
            </h1>
            <p className="text-center text-white mt-2">
              Sign in to book rooms in Blum Hall
            </p>
          </div>
          <div className="p-6">
            <AuthForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-brand-blue text-white p-8 shadow-md">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-center">
                Blum Hall Room Booker
              </h1>
              <p className="text-center text-white mt-2">
                Book any of the rooms in Blum Hall for your study group
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={signOut}
              className="ml-4 flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Section */}
            <div>
              {/* Add a margin-top to the h1 to space it from the top */}
              <h1 className="text-2xl font-semibold mb-6 text-gray-700 mt-8">
                Select a room
              </h1>

              <RoomSelector
                rooms={rooms}
                selectedRoom={selectedRoomId}
                onRoomSelect={roomId =>
                  setSelectedRoomId(selectedRoomId === roomId ? null : roomId)
                }
                loading={loading}
              />

              {/* Conditionally render BookingForm BELOW the RoomSelector */}
              {isFormVisible && (
                <div className="mt-8">
                  {' '}
                  {/* This margin now correctly separates the form from the selector */}
                  <BookingForm
                    status={bookingStatus}
                    onSubmit={handleBookingSubmit}
                    selectionDetails={pendingSelection}
                    bookingMessage={bookingMessage}
                    userEmail={user?.email}
                  />
                </div>
              )}
            </div>
            {/* Right Section - Calendar View */}
            <div>
              <BookingCalendar
                rooms={rooms}
                bookingDetails={bookingDetails}
                currentWeek={currentWeek}
                onWeekChange={setCurrentWeek}
                selectedRoomId={selectedRoomId}
                pendingSelection={pendingSelection}
                onPendingSelectionClear={() => setPendingSelection(null)}
                onTimeSelect={selection => {
                  setPendingSelection(selection);
                  setIsFormVisible(true);
                }}
                currentUserId={user?.id}
                onDeleteBooking={handleDeleteBooking}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
