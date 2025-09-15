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
- `npm run lint` - Runs ESLint and auto-fixes issues
- `npm run lint:check` - Runs ESLint without auto-fixing (used in CI)
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
  "08:00 AM",
  "09:00 AM",
  "10:00 AM", // Add more times
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
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
    const response = await fetch("/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: selectedDate,
        time: selectedTime,
        name,
        email,
      }),
    });

    if (response.ok) {
      setBookingMessage("Booking confirmed!");
    } else {
      setBookingMessage("Booking failed. Please try again.");
    }
  } catch (error) {
    setBookingMessage("Network error. Please try again.");
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

## Database

This project uses [Supabase](https://supabase.com/docs/guides/local-development/cli/getting-started)
for the database. Because the free tier's direct database connection is IPv6-only, we
cannot use supabase db push from most networks. Instead, we will manage schema changes
locally using the Supabase CLI and apply them manually to the production database.

These instructions are important for local development and for deploying schema changes.

1. Start Local Development Environment
   To work on the project locally, you first need to start the Supabase services, which
   run in Docker.

```bash
supabase start
```

This command spins up a local instance of your entire Supabase stack, including a fresh
database.

2. Create a New Migration
   When you want to make a schema change (e.g., create a table, add a column), you
   create a new migration file. This file will contain the SQL for your changes.

Replace your_migration_name with a descriptive name for your change

```bash
supabase migration new create_initial_tables
```

This will create a new SQL file in the supabase/migrations/ directory. Open this file and
add your SQL statements (like CREATE TABLE ...).

3. Apply Migration Locally
   After adding your SQL to the migration file, apply the changes to your local database
   to test them.

```bash
supabase migration up
```

This command runs any new migration files against your local database instance. You can
now connect to the local database to verify your changes.

4. Apply Migration to Production (Manually)
   Since supabase db push is not available, you will apply the migration manually:

- Open the SQL file you created in supabase/migrations/.
- Copy the entire SQL content.
- Navigate to your project in the Supabase Dashboard.
- Go to the SQL Editor.
- Paste the SQL into the editor and click "RUN".

5. Keeping Types in Sync
   To ensure your application code has knowledge of the database schema (for type safety and autocompletion), generate TypeScript types from your local database after applying a migration.

```bash
supabase gen types --lang=typescript --local > src/types/supabase.ts
```

This command inspects your local database and writes the corresponding TypeScript types
to a file in your project. It's recommended to run this after every successful migration.

## Development Standards

### Code Quality

This project enforces code quality standards using ESLint with the following rules:

- **Single quotes** for strings
- **Semicolons** required
- **2-space indentation**
- **Trailing commas** in multiline objects/arrays
- **No unused variables**
- **Modern JavaScript practices** (const/let, arrow functions, template literals)
- **React best practices** (hooks rules, JSX formatting)

### Before Committing

Always run the linter before committing:

```bash
npm run lint
```

### Continuous Integration

Our GitHub Actions workflow automatically runs on all PRs and pushes to `main`/`develop`:

- ✅ **ESLint checks** - Code must pass linting standards
- ✅ **Build verification** - Project must build successfully  
- ✅ **Test execution** - All tests must pass

**The pipeline will fail if linting errors exist**, ensuring consistent code quality across all contributions.

## License

ISC
