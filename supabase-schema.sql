-- สมุดเงิน (Sammut Ngern)
-- Supabase PostgreSQL schema for the app's state shape.
-- The frontend uses js/auth.js and js/core.js to connect after configuration.
-- Running this SQL alone is not enough: configure js/supabase-config.js first.

create extension if not exists pgcrypto;

create table if not exists public.finance_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default jsonb_build_object(
    'v', 1,
    'updatedAt', 0,
    'settings', jsonb_build_object(
      'name', '',
      'baseIncome', 0,
      'savePct', 10,
      'ratio', jsonb_build_array(50, 30, 20),
      'budgets', '{}'::jsonb,
      'projRate', 3
    ),
    'tx', '[]'::jsonb,
    'bills', '[]'::jsonb,
    'pots', '[]'::jsonb,
    'plans', '[]'::jsonb,
    'debts', '[]'::jsonb,
    'goals', '[]'::jsonb,
    'wishes', '[]'::jsonb
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint finance_data_data_is_object check (jsonb_typeof(data) = 'object'),
  constraint finance_data_tx_is_array check (jsonb_typeof(data->'tx') = 'array'),
  constraint finance_data_bills_is_array check (jsonb_typeof(data->'bills') = 'array'),
  constraint finance_data_pots_is_array check (jsonb_typeof(data->'pots') = 'array'),
  constraint finance_data_plans_is_array check (jsonb_typeof(data->'plans') = 'array'),
  constraint finance_data_debts_is_array check (jsonb_typeof(data->'debts') = 'array'),
  constraint finance_data_goals_is_array check (jsonb_typeof(data->'goals') = 'array'),
  constraint finance_data_wishes_is_array check (jsonb_typeof(data->'wishes') = 'array'),
  constraint finance_data_settings_is_object check (jsonb_typeof(data->'settings') = 'object')
);

comment on table public.finance_data is
  'One private Sammut Ngern app-state document per authenticated Supabase user.';
comment on column public.finance_data.data is
  'Matches frontend state keys: v, updatedAt, settings, tx, bills, pots, plans, debts, goals, wishes.';

alter table public.finance_data enable row level security;

drop policy if exists "Users can read their own finance data" on public.finance_data;
drop policy if exists "Users can insert their own finance data" on public.finance_data;
drop policy if exists "Users can update their own finance data" on public.finance_data;
drop policy if exists "Users can delete their own finance data" on public.finance_data;

create policy "Users can read their own finance data"
  on public.finance_data for select to authenticated
  using (auth.uid() = user_id);
create policy "Users can insert their own finance data"
  on public.finance_data for insert to authenticated
  with check (auth.uid() = user_id);
create policy "Users can update their own finance data"
  on public.finance_data for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users can delete their own finance data"
  on public.finance_data for delete to authenticated
  using (auth.uid() = user_id);

grant select, insert, update, delete on public.finance_data to authenticated;
revoke all on public.finance_data from anon;

create or replace function public.set_finance_data_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_finance_data_updated_at on public.finance_data;
create trigger set_finance_data_updated_at
before update on public.finance_data
for each row execute function public.set_finance_data_updated_at();

-- Realtime is optional; do not fail schema setup if publication is unavailable.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (
       select 1 from pg_publication_tables
       where pubname = 'supabase_realtime'
         and schemaname = 'public'
         and tablename = 'finance_data'
     ) then
    alter publication supabase_realtime add table public.finance_data;
  end if;
end;
$$;


-- Optional family-sharing foundation. The current frontend stores one private
-- finance_data document per user; family sharing requires a family-aware UI/data
-- adapter before this membership schema is used to share financial records.
create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(trim(name)) between 1 and 120),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);
create table if not exists public.family_members (
  family_id uuid not null references public.families(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','member')),
  joined_at timestamptz not null default now(),
  primary key (family_id, user_id)
);
create index if not exists family_members_user_id_idx on public.family_members(user_id);
alter table public.families enable row level security;
alter table public.family_members enable row level security;
drop policy if exists "Family members can view their families" on public.families;
create policy "Family members can view their families" on public.families
  for select to authenticated using (
    exists (select 1 from public.family_members fm where fm.family_id = id and fm.user_id = auth.uid())
    or created_by = auth.uid()
  );
drop policy if exists "Authenticated users can create families" on public.families;
create policy "Authenticated users can create families" on public.families
  for insert to authenticated with check (created_by = auth.uid());
drop policy if exists "Members can view family membership" on public.family_members;
create policy "Users can view their own family memberships" on public.family_members
  for select to authenticated using (user_id = auth.uid());
-- Membership writes are intentionally not granted to ordinary users yet.
-- Add an invite/accept workflow or trusted server-side function before enabling them.
grant select, insert on public.families to authenticated;
grant select on public.family_members to authenticated;
