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
