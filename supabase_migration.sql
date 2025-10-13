-- Step 1: Add user_id column to bookings table
ALTER TABLE bookings ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- Step 2: Enable Row Level Security on bookings table
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies for bookings table

-- Policy: Anyone can view bookings (for calendar display)
CREATE POLICY "Anyone can view bookings"
ON bookings
FOR SELECT
USING (true);

-- Policy: Authenticated users can create bookings with their own user_id
CREATE POLICY "Users can create their own bookings"
ON bookings
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own bookings
CREATE POLICY "Users can delete their own bookings"
ON bookings
FOR DELETE
USING (auth.uid() = user_id);

-- Step 4: Create an index on user_id for performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);

-- Optional: If you want to backfill existing bookings with a user_id
-- You can create a temporary admin user or link them to existing person records
-- For now, existing bookings will have NULL user_id (won't be deletable until migrated)
