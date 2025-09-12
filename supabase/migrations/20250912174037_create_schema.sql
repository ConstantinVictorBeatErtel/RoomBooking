-- Create the 'person' table
CREATE TABLE person (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

-- Create the 'rooms' table
CREATE TABLE rooms (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    capacity INT,
    avail_start TIMESTAMP WITH TIME ZONE,
    avail_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create the 'bookings' table
CREATE TABLE bookings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    room_id BIGINT REFERENCES rooms(id) ON DELETE CASCADE,
    person_id BIGINT REFERENCES person(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(room_id, booking_date, booking_time) -- Ensures a room can't be booked at the same date and time
);

-- Comment explaining the relationships from the ERD
COMMENT ON TABLE bookings IS 'This table links a person to a room for a specific booking time. A person can make many bookings (1 to N). A room can be part of many bookings (0 to N, though the diagram shows 0,1 which might imply a room can only be booked once ever which is less common. This schema allows for multiple bookings per room).';
