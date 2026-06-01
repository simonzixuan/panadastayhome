create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings(id) on delete set null,
  name text not null,
  contact text not null,
  budget text,
  move_in_date text,
  message text,
  source text,
  referrer text,
  transferred boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

create policy "Anyone can create leads"
  on public.leads
  for insert
  with check (true);
