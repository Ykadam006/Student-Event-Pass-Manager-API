create table if not exists public.event_passes (
  id text primary key,
  event_name text not null,
  category text not null,
  venue text not null,
  event_date date not null,
  capacity integer not null check (capacity > 0),
  registered_count integer not null check (registered_count >= 0),
  pass_type text not null,
  constraint event_passes_category_check check (
    category in ('Workshop', 'Hackathon', 'Seminar', 'Networking', 'CareerFair')
  ),
  constraint event_passes_pass_type_check check (
    pass_type in ('Free', 'Standard', 'VIP')
  )
);

alter table public.event_passes enable row level security;

-- Server uses the service role key and bypasses RLS. No public policies needed for the API.
-- If you ever query this table from the browser with the anon key, add explicit policies.

insert into public.event_passes (
  id, event_name, category, venue, event_date, capacity, registered_count, pass_type
) values
  ('evt_001', 'Scarlet Hacks Kickoff', 'Hackathon', 'Downtown Campus Room 470', '2026-04-04', 300, 275, 'Free'),
  ('evt_002', 'Frontend Bootcamp', 'Workshop', 'Tech Lab A', '2026-04-12', 60, 60, 'Standard'),
  ('evt_003', 'AI Research Seminar', 'Seminar', 'Engineering Hall 201', '2026-04-20', 120, 70, 'Free'),
  ('evt_004', 'Startup Networking Night', 'Networking', 'Innovation Center', '2026-04-25', 90, 78, 'VIP'),
  ('evt_005', 'Spring Career Fair', 'CareerFair', 'Main Auditorium', '2026-05-01', 500, 410, 'Standard')
on conflict (id) do nothing;
