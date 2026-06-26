create table if not exists public.farm_state (
  id text primary key,
  farmers jsonb not null default '[]'::jsonb,
  chicks jsonb not null default '[]'::jsonb,
  next_id integer not null default 1,
  updated_at timestamptz not null default now()
);

alter table public.farm_state enable row level security;

create policy "Allow public read access" on public.farm_state
  for select
  using (true);

create policy "Allow public insert access" on public.farm_state
  for insert
  with check (true);

create policy "Allow public update access" on public.farm_state
  for update
  using (true)
  with check (true);
