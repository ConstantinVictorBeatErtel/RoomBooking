# FEATURES.md - Room Booking Application

This document tracks feature requirements and implementation status for collaborative development.

**Status Legend:**

- 🔴 TODO - Not started
- 🟡 In Progress - Currently being worked on
- 🟢 Done - Completed and tested

---

## Set Room Names

**Status:** 🔴 TODO

### Requirements

Make the rooms table an entity in Supabase

### Description

- Preserve room selection UI, but auto-render based on total rooms
- Store room name in Supabase and pull available rooms from DB
- Show room name in booking confirmations

### Acceptance Criteria

- [ ] Room selection UI component automatically renders based on total rooms
- [ ] Room name is required field for booking
- [ ] Room ID stored in database with booking
- [ ] Room name displayed in booking confirmation
- [ ] Form validation includes room selection
- [ ] Responsive design maintained

### Implementation Notes

- Update database schema if needed
- Consider adding room descriptions/capacity info later

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
