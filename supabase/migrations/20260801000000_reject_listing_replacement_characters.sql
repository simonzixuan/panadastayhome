alter table public.listings
  add constraint listings_text_no_replacement_character
  check (
    strpos(coalesce(title, ''), chr(65533)) = 0
    and strpos(coalesce(description, ''), chr(65533)) = 0
    and strpos(coalesce(address, ''), chr(65533)) = 0
    and strpos(coalesce(city, ''), chr(65533)) = 0
    and strpos(coalesce(district, ''), chr(65533)) = 0
    and strpos(coalesce(editorial_summary, ''), chr(65533)) = 0
  ) not valid;

alter table public.listings
  validate constraint listings_text_no_replacement_character;
