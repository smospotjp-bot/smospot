-- SmoSpot: user-submitted smoking reports
create table if not exists smoking_reports (
  id uuid primary key default gen_random_uuid(),
  place_id text not null,
  smoking_allowed boolean,
  smoking_area text,
  reported_at timestamptz default now(),
  reporter_ip text,
  is_closed boolean default false
);

create index if not exists smoking_reports_place_id_idx
  on smoking_reports (place_id);

-- Row Level Security: allow public read + insert (anon key), block update/delete.
alter table smoking_reports enable row level security;

create policy "public read" on smoking_reports
  for select using (true);

create policy "public insert" on smoking_reports
  for insert with check (true);
