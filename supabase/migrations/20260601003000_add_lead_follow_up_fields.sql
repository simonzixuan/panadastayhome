alter table public.leads
  add column if not exists assigned_to text,
  add column if not exists next_follow_up_at date;
