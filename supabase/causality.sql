-- Challenge 4: Causality Auditor Database
-- Stores the latest causality analysis.

-- Create the table
create table public.causality_latest (
  key text primary key,
  probe jsonb not null,
  answer jsonb not null,
  summary jsonb not null,
  updated_at timestamptz not null default now()
);

-- Enable row-level security
alter table public.causality_latest
enable row level security;

-- Allow reading
create policy "anyone can read"
on public.causality_latest
for select using (true);

-- Allow inserting
create policy "anyone can insert"
on public.causality_latest
for insert with check (true);

-- Allow updating
create policy "anyone can update"
on public.causality_latest
for update using (true);

-- Grant permissions
grant select, insert, update
on public.causality_latest to anon;
