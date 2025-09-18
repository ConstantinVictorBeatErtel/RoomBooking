-- Add duration column to bookings table
ALTER TABLE bookings ADD COLUMN duration_hours INTEGER NOT NULL DEFAULT 1;

-- Add comment to describe the new column
COMMENT ON COLUMN bookings.duration_hours IS 'Duration of the booking in hours (1, 2, or 3)';

-- Update the unique constraint to include duration
-- First drop the existing constraint
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_room_id_booking_date_booking_time_key;

-- Add new constraint that allows same room/date/time but different durations
-- This will be handled by application logic instead of database constraints
-- since we need to check for overlapping time ranges
