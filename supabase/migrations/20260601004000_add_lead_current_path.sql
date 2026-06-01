alter table public.leads
  add column if not exists current_path text;
