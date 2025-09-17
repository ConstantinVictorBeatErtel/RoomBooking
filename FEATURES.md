# FEATURES.md - Room Booking Application

This document tracks feature requirements and implementation status for collaborative development.

**Status Legend:**

- 🔴 TODO - Not started
- 🟡 In Progress - Currently being worked on
- 🟢 Done - Completed and tested

---

## Set Room Names

**Status**: 🟢 Done

### Requirements

Establish a Supabase project with a defined schema for person, rooms, and bookings
tables, and set up a local development and manual deployment workflow.

### Description

This initial setup work involved designing the database schema, creating migration files,
and establishing a repeatable process for local development.

- **Data Model**: An ERD was designed to model people, rooms, and the bookings that
  connect them.
- **Migrations**: An initial SQL migration was created to set up the person, rooms, and
  bookings tables with appropriate columns and foreign key relationships.
- **Local Development**: The Supabase CLI was initialized. A README.md file documents the
  process for starting the local environment, creating new migrations, and applying them
- **Seeding**: A seed.sql script was created to populate the local database with initial
  person and rooms data for consistent testing.
- **Type Safety**: A process was established to generate TypeScript types from the
  database schema, ensuring the application codebase can be kept in sync.
- **Deployment**: Due to free-tier IPv4 limitations, a manual "copy-paste" process for
  running migrations on the production Supabase instance via the SQL Editor was
  documented.

### Acceptance Criteria

[x] ERD for person, rooms, and bookings is defined.
[x] Initial SQL migration file exists in supabase/migrations.
[x] README.md contains instructions for the local development workflow.
[x] seed.sql populates the database with two people and four rooms.
[x] A command to generate supabase.ts types is documented.

### Implementation Notes

The project uses a manual migration strategy for production due to the direct database connection being IPv6-only on the Supabase free tier. The supabase db push command will fail.

---

## Integrate App with Supabase Schema

**Status**: 🟢 Done

### Requirements

Update the application's booking functionality to fetch data from and write data to the new person, rooms, and bookings tables in Supabase.

### Description

The current application likely uses hardcoded data for people and rooms. This feature will refactor the booking form and submission logic to be fully integrated with the Supabase database. The person field will become a dropdown populated from the person table, rooms will be displayed dynamically, and a successful submission will create a new record in the bookings table.

### Acceptance Criteria

[x] The user input field for a person's name is replaced with a dropdown menu.
[x] The person dropdown is dynamically populated with the names of all people from the person table in the database.
[x] The UI dynamically displays the list of available rooms by fetching data from the rooms table.
[x] On form submission, a new row is inserted into the bookings table.
[x] The new bookings record correctly references the selected person_id and room_id.
[x] Existing logic for calculating room availability is not changed.
[x] Existing form validation is not changed.

### Implementation Notes

- Use the supabase-js client library to perform database operations.
- Fetch data for the person dropdown and room display when the component mounts.
- Use the generated TypeScript types (supabase.ts) for all client-side database interactions to ensure type safety.

The form submission function should now be an async function that calls supabase.from('bookings').insert(...).

---

## Fix Aesthetic Bugs

**Status:** 🟢 Done

### Requirements

- Booked Times do not get grayed out on the application
- Room Name doesn't wrap within the box
- Auto-load email from persons table, since person always has email, and do not allow
  edit

### Acceptance Criteria

- [x] Booked Times are correctly grayed out, and do not allow the user to select it,
      with a cursor-not-allowed css
- [x] Overall width should be adjusted so the room name does not wrap
- [x] Emails are not editable
- [x] Emails are auto-populated on the form

### Implementation Notes

- Use the MCP tool playwright available on Cursor to check out the frontend

---

## Fix Available Times Rendering and Bug

**Status:** ✅ COMPLETED

### Requirements

Available Times should be rendered in a user-friendly way, without disrupting the
calculation of available times for a room booking.

### Description

- The constant @AVAILABLE_TIMES details the times that you can book a room
- We should replace it with the available times for each room from the `rooms` table,
  where it is stored as a timestamp with timezone (UTC). Those times need to be
  converted to Pacific Standard Timezone, which is where our building is
- Next, we need to display those possible times in 1 hours chunks as:
  - 09:00 AM
  - 10:00 AM
  - ...
  - 01:00 PM
    So, 5 total characters, and then an AM and PM
- Finally, when calculating the Available Times in what the RoomBookingPage
  component returns, when we create the const `bookedTimesForDate`, and check if the
  `bookedTimesForDate` to assert `isBooked`, we need to ensure we are accurately
  checking consistent types. Previously, we had defined available times as the strings
  of `09:00 AM`, but the value of `time` the user selected as 13:00, for example.

### Acceptance Criteria

- [x] All times are displayed in PST (given that database stores UTC)
- [x] All available times are displayed in 1 hour chunks as `HH:MM AM` or `HH:MM PM`
- [x] The comparison that validates whether a time is booked or not needs to occur accurately
- [x] Available Times need to be pulled from each room's availability

### Implementation Notes

- Note that rooms stores availability as avail_start and avail_end, which includes a date component. The date component can be discarded for now.

---

## Send Confirmation Email

**Status:** 🔴 TODO

### Requirements

Send a confirmation email to the email provided

### Description

- User enters their email (required) to book - we should send them a confirmation email

### Acceptance Criteria

- [ ] Email is a required field on form
- [ ] Email is sent once the booking is confirmed

### Implementation Notes

- Download external package for email writing if needed

## Typable Name

**Status:** 🟢 Done

### Requirements

Allow users to type their name and email, instead of setting from a prefixed dropdown

### Description

- Students should type their own name and email into a text box to book a room
- Both fields are required
- Email must be a Berkeley address (ending with @berkeley.edu)
- On confirming booking, the name / email combination should be saved to the person table
  if it doesn't already exist (email is unique and 1:1 with person.id)


### Acceptance Criteria

- [x] Name and email are type-able required fields on the booking form
- [x] Email validation ensures only Berkeley addresses (@berkeley.edu) are accepted
- [x] Name and email should be stored in the database upon submission
- [x] If person exists, store booking data using existing person_id. if not, create new 
      person and then new booking

### Implementation Notes

- Download external package for email writing if needed

## Admin View

**Status:** 🔴 NOT READY

### Requirements

Create a visual view based on the schema on the state of all current registrations

### Description

- The student assistant for the space needs a view to confirm the booked schedules
  of each room in the space
- This view could also be visually helpful for others identifying when they could
  book a room
- The view must list:
    - Each room
    - Their total availability (scheduled, not scheduled & available, not available)
    - For scheduled, some way to discern who has booked it


### Acceptance Criteria

- [ ] A separate view called "Schedule" is created
- [ ] Schedule view shows you the availabiltiy of all four rooms visually

### Implementation Notes

- Download external package for email writing if needed