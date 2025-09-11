import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar as CalendarIcon, Clock, User, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

// Simple Button component
const Button = ({ children, onClick, variant = 'default', className = '', type = 'button', ...props }) => {
  const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Simple Input component
const Input = ({ label, className = '', ...props }) => {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        {...props}
      />
    </div>
  );
};

// Simple Label component
const Label = ({ children, className = '', ...props }) => {
  return (
    <label className={`block text-sm font-medium text-gray-700 ${className}`} {...props}>
      {children}
    </label>
  );
};

// Simple Calendar component
const Calendar = ({ selected, onSelect, mode = 'single' }) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(selected || today);
  
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const handleDayClick = (day) => {
    if (day && day >= today) {
      onSelect(day);
    }
  };
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          ←
        </button>
        <h3 className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          →
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
        {days.map((day, index) => (
          <button
            key={index}
            onClick={() => handleDayClick(day)}
            disabled={!day || day < today}
            className={`
              p-2 text-sm rounded-md transition-colors
              ${!day ? 'invisible' : ''}
              ${day && day < today ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}
              ${selected && day && day.toDateString() === selected.toDateString() 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700'
              }
            `}
          >
            {day ? day.getDate() : ''}
          </button>
        ))}
      </div>
    </div>
  );
};

// Simple Popover components
const Popover = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const childrenArray = React.Children.toArray(children);
  const trigger = childrenArray[0];
  const content = childrenArray[1];

  const triggerChild = trigger && trigger.props && trigger.props.children
    ? trigger.props.children
    : trigger;

  const handleToggle = () => setIsOpen((prev) => !prev);

  const clonedTrigger = React.isValidElement(triggerChild)
    ? React.cloneElement(triggerChild, {
        onClick: (...args) => {
          if (typeof triggerChild.props?.onClick === 'function') {
            triggerChild.props.onClick(...args);
          }
          handleToggle();
        }
      })
    : null;

  return (
    <div className="relative">
      {clonedTrigger}
      {isOpen && (
        <div className="absolute z-10 mt-2 w-auto bg-white border border-gray-200 rounded-lg shadow-lg">
          {content && content.props ? content.props.children : content}
        </div>
      )}
    </div>
  );
};

const PopoverTrigger = ({ children, asChild = false }) => {
  return children;
};

const PopoverContent = ({ children, className = '' }) => {
  return (
    <div className={`p-0 ${className}`}>
      {children}
    </div>
  );
};

export default function RoomBookingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [bookings, setBookings] = useState({}); // { 'yyyy-MM-dd': ['09:00 AM', ...] }

  // Load bookings for selected date from Supabase
  useEffect(() => {
    const load = async () => {
      if (!supabase || !selectedDate) return;
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_time')
        .eq('room_id', 'default')
        .eq('booking_date', dateKey);
      if (!error && Array.isArray(data)) {
        setBookings((prev) => ({ ...prev, [dateKey]: data.map(r => r.booking_time) }));
      }
    };
    load();
  }, [selectedDate]);

  const availableTimes = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM'
  ];

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !email) {
      setBookingMessage('Please fill in all fields.');
      return;
    }
    
    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
    const bookedTimesForDate = (dateKey && bookings[dateKey]) ? bookings[dateKey] : [];
    if (bookedTimesForDate.includes(selectedTime)) {
      setBookingMessage('That time is already booked for the selected date.');
      return;
    }
    // Persist booking to Supabase
    if (supabase) {
      const { error } = await supabase.from('bookings').insert({
        room_id: 'default',
        booking_date: dateKey,
        booking_time: selectedTime,
        name,
        email
      });
      if (error) {
        const code = (error.code || '').toString();
        if (code === '23505') {
          setBookingMessage('That time is already booked for the selected date.');
        } else {
          setBookingMessage('Failed to save booking. Please try again.');
        }
        return;
      }
    }
    
    // Optimistically update local state after successful insert
    setBookings((prev) => {
      const next = { ...prev };
      const existing = next[dateKey] || [];
      next[dateKey] = existing.includes(selectedTime) ? existing : [...existing, selectedTime];
      return next;
    });

    setBookingMessage(`Booking for ${name} on ${selectedDate.toLocaleDateString()} at ${selectedTime} confirmed!`);
    
    // Optionally reset form fields after successful submission
    setTimeout(() => {
      setName('');
      setEmail('');
      setSelectedTime('');
      setBookingMessage('');
    }, 3000);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6">
          <h1 className="text-3xl font-bold text-center">Book a Room</h1>
          <p className="text-center text-blue-100 mt-2">Select your preferred date and time</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar and Time Selection Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
                <CalendarIcon className="mr-2 h-6 w-6" />
                Select Date & Time
              </h2>
              
              <div className="mb-6">
                <Label className="mb-3 block">
                  Date
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${!selectedDate ? "text-gray-500" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
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
                    <Calendar
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setShowCalendar(false);
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="mb-6">
                <Label className="mb-3 block flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Available Times
                </Label>
                {(() => {
                  const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null;
                  const bookedTimesForDate = (dateKey && bookings[dateKey]) ? bookings[dateKey] : [];
                  return (
                    <>
                      <div className="grid grid-cols-3 gap-2">
                        {availableTimes.map((time) => {
                          const isBooked = bookedTimesForDate.includes(time);
                          return (
                            <Button
                              key={time}
                              variant={selectedTime === time && !isBooked ? 'default' : 'outline'}
                              onClick={() => !isBooked && setSelectedTime(time)}
                              disabled={isBooked}
                              className={`w-full ${isBooked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {time}{isBooked ? ' (Booked)' : ''}
                            </Button>
                          );
                        })}
                      </div>
                      {bookedTimesForDate.length > 0 && (
                        <p className="mt-2 text-sm text-gray-500">
                          Booked for this date: {bookedTimesForDate.join(', ')}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Booking Form Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-700 flex items-center">
                <User className="mr-2 h-6 w-6" />
                Your Details
              </h2>
              
              <form onSubmit={handleBookingSubmit} className="space-y-6">
                <Input
                  label="Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                />
                
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  required
                />
                
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                >
                  Confirm Booking
                </Button>
                
                {bookingMessage && (
                  <div className={`mt-4 p-4 rounded-md flex items-center ${
                    bookingMessage.includes('confirmed') 
                      ? 'bg-green-50 text-green-800 border border-green-200' 
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}>
                    {bookingMessage.includes('confirmed') ? (
                      <CheckCircle className="mr-2 h-5 w-5" />
                    ) : (
                      <AlertCircle className="mr-2 h-5 w-5" />
                    )}
                    <span className="font-medium">{bookingMessage}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
