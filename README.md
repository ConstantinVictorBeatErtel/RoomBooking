# Room Booking Application

A standalone React application for booking rooms with date and time selection.

## Features

- 📅 Interactive calendar for date selection
- ⏰ Time slot selection
- 👤 User information form
- ✅ Booking confirmation
- 📱 Responsive design
- 🎨 Modern UI with Tailwind CSS

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd room-booking-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Usage

1. **Select Date**: Click on the calendar to choose your preferred date
2. **Choose Time**: Select an available time slot from the grid
3. **Enter Details**: Fill in your name and email address
4. **Confirm Booking**: Click the "Confirm Booking" button

## Features in Detail

### Calendar
- Shows current month with navigation
- Disables past dates
- Highlights selected date
- Responsive grid layout

### Time Selection
- Pre-defined time slots (9 AM - 5 PM)
- Visual feedback for selected time
- Grid layout for easy selection

### Form Validation
- Required field validation
- Email format validation
- Real-time feedback

### Booking Confirmation
- Success/error messages
- Auto-reset after 3 seconds
- Console logging for debugging

## Customization

### Adding More Time Slots
Edit the `availableTimes` array in `RoomBookingPage.js`:

```javascript
const availableTimes = [
  '08:00 AM', '09:00 AM', '10:00 AM', // Add more times
  '11:00 AM', '12:00 PM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM',
  '05:00 PM', '06:00 PM', '07:00 PM'
];
```

### Styling
The app uses Tailwind CSS for styling. You can customize:
- Colors in the gradient header
- Button styles and variants
- Form input styling
- Calendar appearance

### Backend Integration
To connect to a backend API, modify the `handleBookingSubmit` function:

```javascript
const handleBookingSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        date: selectedDate,
        time: selectedTime,
        name,
        email,
      }),
    });
    
    if (response.ok) {
      setBookingMessage('Booking confirmed!');
    } else {
      setBookingMessage('Booking failed. Please try again.');
    }
  } catch (error) {
    setBookingMessage('Network error. Please try again.');
  }
};
```

## Project Structure

```
room-booking-app/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── RoomBookingPage.js
│   ├── App.js
│   └── index.js
├── package.json
└── README.md
```

## Technologies Used

- **React** - UI library
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icons
- **date-fns** - Date utilities
- **Create React App** - Build tooling

## License

ISC
