-- Add description column to rooms table
ALTER TABLE rooms ADD COLUMN description TEXT;

-- Add comment to describe the new column
COMMENT ON COLUMN rooms.description IS 'Room description for additional details about the room';
