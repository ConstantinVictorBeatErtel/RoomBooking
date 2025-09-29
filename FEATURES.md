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

---

## Feature: Refactor Booking Pill Rendering for Concurrent Bookings

**Status:** 🟢 Done

### Requirements

1.  In `BookingCalendar.js`, locate the rendering logic within the `hours.map` loop 
    where `bookings` for a specific time slot are rendered.
2.  For any given time slot, determine the total number of concurrent bookings (`n`).
3.  Modify the mapping logic (`bookings.map(...)`) so that each booking pill is rendered
    with a calculated width and horizontal position.
4.  The width of each pill should be approximately `1/n` of the cell's total width.
5.  The horizontal position (e.g., `left` offset) of each pill should be based on its 
    index in the array of concurrent bookings. For example, the first pill is at `0%`, 
    the second at `width`, and so on.
6.  Ensure a small margin or gap between the concurrent pills for visual separation.

### Description

This task modifies the existing `BookingCalendar` component to correctly display the "All
Rooms" view from the wireframe. Currently, if two rooms are booked at the same time, 
their "pills" will overlap. This change will update the rendering logic to calculate the
number of concurrent bookings in a time slot and then dynamically set the `width` and 
`left` CSS properties for each pill. The result will be multiple, smaller pills sitting 
side-by-side within a single time slot, each representing a different room's booking.

### Acceptance Criteria

- When two or more bookings exist for the same time slot on the same day, they render 
  as distinct, side-by-side pills and do not overlap.
- Each concurrent pill occupies an equal fraction of the available horizontal space in
  the cell.
- A single booking in a time slot continues to render as a full-width pill (or nearly 
  full-width).
- The pill's height correctly reflects its `duration_hours`.


## Feature: Refactor Booking Pills to Use Fixed Lane Positioning

**Status:** 🟢 Done

### Requirements

1.  Create a stable mapping that assigns a permanent horizontal "lane" (an index from 0 
    to 3) to each `room_id`. This can be a simple object or array. The order should be 
    consistent (e.g., Green room is always lane 0, Red is lane 1, etc.).
2.  Remove the previous logic in `BookingCalendar.js` that dynamically calculates the 
    `width` and `left` properties of a booking pill based on the number of concurrent 
    bookings.
3.  For each booking pill being rendered, use its `room_id` to look up its assigned lane
    index from the mapping.
4.  Set the CSS `width` of every booking pill to a fixed percentage that accommodates 
    four lanes (e.g., `25%`).
5.  Set the CSS `left` property of each pill based on its lane index 
    (e.g., `left: calc(25% * laneIndex)`).
6.  Ensure there is a small, consistent visual gap between the lanes.

### Description

To fix visual bugs with overlapping multi-hour bookings, we are moving from a dynamic 
layout to a static "lane" system. The previous logic, which calculated pill widths based
 on conflicts, created edge cases. This new approach simplifies the design by assigning 
 each room a fixed horizontal track. All booking pills will now have a narrow, consistent
  width, and their horizontal position will be determined solely by the room they belong
   to, eliminating all rendering conflicts.

### Acceptance Criteria

- [x]  All booking pills now render with the same fixed, narrow width (approximately 25% 
       of the time slot).
- [x]  A booking for a specific room (e.g., the "Red room") will always appear in the 
       same horizontal lane, regardless of other bookings.
- [x]  Multi-hour bookings correctly stay within their assigned lane for their entire 
       duration.
- [x]  The visual bug where the yellow and red rooms overlapped is now resolved.
- [x]  The calendar is visually clean and predictable, even with many overlapping 
       bookings.

## Feature: Implement Single-Room Calendar View

**Status:** 🟢 Done

### Requirements

1.  The parent component (`RoomBookingPage.js`) must manage a new state variable, 
    `selectedRoomId`, which can hold a room's ID or be `null`.
2.  The "Select a room" buttons at the top of the page should update the 
    `selectedRoomId` state when clicked. Clicking an already selected room should set 
    `selectedRoomId` back to `null`.
3.  Pass the `selectedRoomId` state down to the `BookingCalendar` component as a prop.
4.  Inside `BookingCalendar.js`, modify the rendering logic based on the 
    `selectedRoomId` prop:
    - **If `selectedRoomId` is `null`:** Render the calendar exactly as it does now 
      (the "All Rooms" view with narrow, fixed-lane pills).
    - **If a `selectedRoomId` is provided:**
        - Before rendering, filter the `bookingDetails` array to only include bookings 
          matching the `selectedRoomId`.
        - Render these filtered booking pills differently: they should be much wider 
          (e.g., `~95%` of the cell width) and display the `person_name` inside the 
          pill. The static "lane" positioning is not needed in this view.

### Description

This feature brings the new user flow to life. When a user clicks on a room name, the 
calendar will filter to display a detailed schedule for only that room. This involves 
managing the selection state in the parent component and adding conditional logic to the
`BookingCalendar` to switch between the "All Rooms" overview and the new, detailed 
"Single Room" view. This step is crucial for setting up the drag-to-book functionality 
that will follow.

### Acceptance Criteria

- [x]  On initial load, the calendar displays the "All Rooms" view with narrow, 
       multi-colored pills.
- [x]  Clicking a room button (e.g., "Founders Conference Room") filters the 
       `BookingCalendar` to show only the bookings for that room.
- [x]  In the "Single Room" view, the booking pills are wide and clearly display the 
       name of the person who made the booking.
- [x]  Clicking the active room button again deselects it, returning the calendar to the
       "All Rooms" view.

## Feature: Implement Drag-to-Select for Room Booking

**Status:** 🟢 Done

### Requirements

1.  Add new state variables to the `BookingCalendar.js` component to track the drag 
   action. This should include at least:
    - `isDragging` (boolean)
    - `selectionStart` (object containing date/time of where the drag began)
    - `selectionEnd` (object containing date/time of the current mouse position)
2.  Add `onMouseDown`, `onMouseEnter`, and `onMouseUp` event handlers to the individual 
    time slot `div`s in the calendar grid.
3.  The drag functionality must only be enabled when in the "Single Room" view (i.e., 
    when the `selectedRoomId` prop is not `null`).
4.  A drag action cannot be initiated on a time slot that is already occupied by a 
    booking.
5.  When `isDragging` is `true`, apply a visual highlight (e.g., a semi-transparent 
    background color) to all time slots between `selectionStart` and `selectionEnd`.
6.  When the `onMouseUp` event is triggered, call a new function passed via props called
    `onTimeSelect`. This function should receive an object with the final selection 
    details: `{ roomId, startTime, endTime }`. For now, console.log the final selection
    details.
7.  After the drag is complete, reset the component's internal drag-related state.

### Description

This is the final interactive piece of the UI overhaul. We will enhance the 
`BookingCalendar` to allow users to create a booking by clicking and dragging over 
available time slots. This feature will only be active when a single room has been 
selected. As the user drags, the calendar will provide real-time visual feedback by 
highlighting the selected range. Once the user releases the mouse, the selected time 
information will be passed up to the parent component to initiate the booking process.

### Acceptance Criteria

- [x] In "Single Room" view, clicking on an empty time slot and dragging the mouse 
    highlights the selected range.
- [x] The visual highlighting updates correctly as the mouse moves across different time
      slots.
- [x] Releasing the mouse button triggers the `onTimeSelect` prop with the correct 
      `roomId`, `startTime`, and `endTime`.
- [x] The visual highlighting is removed from the calendar after the selection is 
      complete.
- [x] Attempting to click and drag on an existing booking pill does nothing.
- [x] The drag-to-select functionality is completely disabled in the "All Rooms" view.

## Feature: Finalize Booking Selection and Display Form

**Status:** 🟢 Done

### Requirements

1.  In the parent component (`RoomBookingPage.js`), create a new state variable called 
    `pendingSelection`. Initialize it to `null`.
2.  The `onTimeSelect` function, which is passed to `BookingCalendar`, should update 
    this `pendingSelection` state with the data it receives.
3.  Pass the `pendingSelection` state object down as a new prop to the `BookingCalendar`
    component.
4.  In `BookingCalendar`, add logic to apply a persistent "selected" style (the same as 
    the drag highlight) to any time slots that fall within the range of the 
    `pendingSelection` prop. This styling should be independent of the `isDragging` 
    state.
5.  In `RoomBookingPage.js`, add conditional rendering logic:
    - If `pendingSelection` is `null`, render the old UI (the date picker, etc.).
    - If `pendingSelection` has data, render the `BookingForm` component instead.
6.  Clicking "Confirm booking" should run the validation and if successful, reset 
    `pendingSelection` back to `null`.

### Description

This feature connects the interactive calendar to the booking form, creating a complete 
user flow. When a user finishes dragging to select a time, that selection will now persist
visually on the calendar. This is achieved by having the parent page manage the 
selection state. This same state will also trigger the `BookingForm` to appear, 
replacing the old booking controls.

### Acceptance Criteria

- [x] After a user drags and releases the mouse, the selected time range remains 
      highlighted on the calendar.
- [x] As soon as the selection is made, the `BookingForm` appears on the left side of 
      the screen.
- [x] The old date and time picker controls are hidden when the `BookingForm` is 
      visible.
- [x] Cancelling or submitting the form clears the `pendingSelection` state, which 
      removes the highlighting from the calendar and hides the form.

## Feature: Refactor Booking Submission to Use Only `pendingSelection`

**Status:** 🟢 Done

### Requirements

1.  Modify the `handleBookingSubmit` function to remove all fallback logic to the old 
    state variables (`selectedDate`, `selectedTime`, `selectedDuration`, `selectedRoom`).
2.  Add a guard clause at the top of the function to exit early if `pendingSelection` 
    is not available (e.g., `if (!pendingSelection) return;`).
3.  Derive the `bookingDate`, `bookingTime`, and `bookingDuration` variables directly 
    and exclusively from the `pendingSelection` object's `startTime` and `endTime`. 
    You will need helpers from `date-fns` like `format` and `differenceInHours`.
4.  Remove the manual, local state updates at the end of the function 
    (`setBookings(...)` and `setBookingDetails(...)`).
5.  Instead of the manual updates, ensure the function that fetches all calendar data 
    from Supabase (likely named `fetchBookingDetails`) is called again after a 
    successful booking to refresh the calendar with the new, confirmed booking.

### Description

This is the primary refactoring step to decouple our logic from the old UI. We will 
modify the booking submission handler to rely solely on the `pendingSelection` object 
created by the new drag-to-select flow. This change simplifies the function and makes the 
old booking state (`selectedDate`, etc.) obsolete. We will also improve data consistency
 by re-fetching all bookings from the database after a successful submission, rather 
 than attempting to update the local state manually.

### Acceptance Criteria

- [x] A booking submitted through the new drag-and-select flow works correctly.
- [x] The `handleBookingSubmit` function no longer references `selectedDate`, 
      `selectedTime`, `selectedDuration`, or `selectedRoom`.
- [x] After a booking is successfully created, the calendar view automatically refreshes
      to display the new booking pill from the database.
- [x] The old booking method (using the date/time pickers) will no longer work, which is
      the expected outcome of this change.
