-- This script seeds the database with initial data for development purposes.
-- It should be run after the migrations have been applied.

-- Seed data for the 'person' table
INSERT INTO public.person (name, email) VALUES
('Constantin Ertel', 'constantinertel@berkeley.edu'),
('Sanchit Ram Arvind', 'sanchitram@berkeley.edu');

-- Seed data for the 'rooms' table
-- avail_start and avail_end are example timestamps and can be adjusted.
INSERT INTO public.rooms (name, capacity, avail_start, avail_end) VALUES
('The Foursquare', 4, '2025-01-01 09:00:00-08', '2025-12-31 17:00:00-08'),
('Quad-ratic Analysis', 4, '2025-01-01 09:00:00-08', '2025-12-31 17:00:00-08'),
('The Data Octagon', 8, '2025-01-01 08:00:00-08', '2025-12-31 20:00:00-08'),
('Binary Booth', 2, '2025-01-01 08:00:00-08', '2025-12-31 20:00:00-08');
