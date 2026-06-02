create table if not exists public.trusted_publishers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  trusted boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trusted_publishers enable row level security;

drop policy if exists "Users can read own trusted publisher status" on public.trusted_publishers;

create policy "Users can read own trusted publisher status"
on public.trusted_publishers
for select
to authenticated
using (auth.uid() = user_id and trusted = true);

grant select on public.trusted_publishers to authenticated;
