alter table public.leads
  add column if not exists status text not null default 'new',
  add column if not exists notes text;
