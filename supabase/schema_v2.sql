-- Phase-1/Final relational schema (3-table model)
create table if not exists public.students (
  id text primary key,
  name text not null,
  email text not null unique,
  major text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id text primary key,
  title text not null,
  description text,
  location text not null,
  event_date date not null,
  capacity integer not null check (capacity > 0),
  status text not null default 'UPCOMING' check (status in ('UPCOMING', 'FULL', 'CANCELLED', 'COMPLETED')),
  created_at timestamptz not null default now()
);

create table if not exists public.registrations (
  id text primary key,
  student_id text not null references public.students(id) on delete cascade,
  event_id text not null references public.events(id) on delete cascade,
  status text not null default 'REGISTERED' check (status in ('REGISTERED', 'CANCELLED')),
  created_at timestamptz not null default now(),
  unique(student_id, event_id)
);

create index if not exists idx_events_date on public.events(event_date);
create index if not exists idx_events_status on public.events(status);
create index if not exists idx_registrations_event on public.registrations(event_id);
create index if not exists idx_registrations_student on public.registrations(student_id);

-- Seed sample records
insert into public.students (id, name, email, major)
values
  ('stu_1', 'Alex Kim', 'alex.kim@hawk.illinoistech.edu', 'CS'),
  ('stu_2', 'Priya Shah', 'priya.shah@hawk.illinoistech.edu', 'ITM'),
  ('stu_3', 'Jordan Lee', 'jordan.lee@hawk.illinoistech.edu', 'ECE')
on conflict (id) do nothing;

insert into public.events (id, title, description, location, event_date, capacity, status)
values
  ('evt_101', 'Backend API Workshop', 'REST and GraphQL', 'Kaplan Institute', '2026-05-10', 60, 'UPCOMING'),
  ('evt_102', 'Cloud Deployment Lab', 'Azure hands-on deployment', 'Tech Lab A', '2026-05-18', 40, 'UPCOMING')
on conflict (id) do nothing;

insert into public.registrations (id, student_id, event_id, status)
values
  ('reg_101', 'stu_1', 'evt_101', 'REGISTERED'),
  ('reg_102', 'stu_2', 'evt_101', 'REGISTERED')
on conflict (id) do nothing;
