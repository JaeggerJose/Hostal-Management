create type booking_status as enum ('confirmed', 'cancelled', 'conflict');
create type booking_source as enum ('manual', 'booking_com');

create table rooms (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  type text,
  capacity int default 2,
  color text default '#0d9488',
  ical_url text
);

create table guests (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  name text not null,
  phone text default '',
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
