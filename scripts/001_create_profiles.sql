-- Create profiles table for worker information
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  job_title text,
  city text,
  years_of_experience integer,
  daily_tasks text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS Policies
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, job_title, city, years_of_experience, daily_tasks)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'job_title', null),
    coalesce(new.raw_user_meta_data ->> 'city', null),
    coalesce((new.raw_user_meta_data ->> 'years_of_experience')::integer, null),
    coalesce(new.raw_user_meta_data ->> 'daily_tasks', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
