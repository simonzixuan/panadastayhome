alter table public.listings
  add column if not exists editorial_summary text,
  add column if not exists verification_status text not null default 'pending',
  add column if not exists verified_at timestamptz;

alter table public.listings
  drop constraint if exists listings_verification_status_check;

alter table public.listings
  add constraint listings_verification_status_check
  check (
    verification_status in (
      'pending',
      'contacting',
      'verified_available',
      'stale',
      'unavailable'
    )
  );

create index if not exists listings_verification_status_idx
  on public.listings (verification_status);
