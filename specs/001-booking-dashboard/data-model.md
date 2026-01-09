# Data Model: Hostal Booking Dashboard

## Entities

### `rooms`
Physical rooms in the hostel.
- `id` (UUID, PK)
- `name` (Text): Room number or name (e.g., "101", "Sea View").
- `type` (Text): e.g., "Double", "Dorm".
- `capacity` (Int): Number of guests.
- `color` (Text): Hex code for calendar display.
- `ical_url` (Text, nullable): Booking.com export URL for this room.

### `guests`
Record of past and current guests.
- `id` (UUID, PK)
- `created_at` (Timestamp)
- `name` (Text): Full name.
- `phone` (Text, unique): Primary lookup field.
- `email` (Text, nullable).
- `notes` (Text): Preferences, history.
- `visit_count` (Int): Auto-incremented logic or manual.

### `bookings`
Reservations.
- `id` (UUID, PK)
- `created_at` (Timestamp)
- `room_id` (UUID, FK -> rooms.id)
- `guest_id` (UUID, FK -> guests.id, nullable): Nullable if external sync doesn't provide guest details instantly or if it's a "block".
- `guest_name` (Text): Fallback name if guest_id not linked (common for iCal imports).
- `check_in` (Date)
- `check_out` (Date)
- `status` (Enum): `confirmed`, `cancelled`, `conflict`.
- `source` (Enum): `manual`, `booking_com`.
- `external_id` (Text, unique): UID from iCal event to prevent duplicates.
- `raw_data` (JSONB): Store full iCal event data for debugging.

## Database Schema (Supabase/PostgreSQL)

```sql
create type booking_status as enum ('confirmed', 'cancelled', 'conflict');
create type booking_source as enum ('manual', 'booking_com');

create table rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text,
  capacity int default 2,
  color text default '#3788d8',
  ical_url text
);

create table guests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  phone text,
  email text,
  notes text,
  visit_count int default 1
);

create table bookings (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  room_id uuid references rooms(id) not null,
  guest_id uuid references guests(id),
  guest_name text, -- Cache name here for iCal imports
  check_in date not null,
  check_out date not null,
  status booking_status default 'confirmed',
  source booking_source default 'manual',
  external_id text, -- Unique constraint scoped to source usually, or global
  raw_data jsonb,
  constraint check_dates check (check_out > check_in)
);
```
