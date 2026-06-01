alter table public.listings
  add column if not exists publisher_type text,
  add column if not exists listing_source text,
  add column if not exists review_notes text;
