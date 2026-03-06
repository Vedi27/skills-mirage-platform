-- Add columns for Google OAuth user data (full_name, avatar_url)
alter table public.profiles
  add column if not exists full_name text,
  add column if not exists avatar_url text;

-- Update trigger to populate profile from OAuth (Google) or email signup metadata
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    avatar_url,
    job_title,
    city,
    years_of_experience,
    daily_tasks
  )
  values (
    new.id,
    -- Google OAuth provides full_name and avatar_url in raw_user_meta_data
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name', null),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture', null),
    coalesce(new.raw_user_meta_data ->> 'job_title', null),
    coalesce(new.raw_user_meta_data ->> 'city', null),
    coalesce((new.raw_user_meta_data ->> 'years_of_experience')::integer, null),
    coalesce(new.raw_user_meta_data ->> 'daily_tasks', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;
