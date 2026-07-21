-- IndicaMed v6: tabla privada por usuario
create table if not exists public.indicamed_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  doctor jsonb,
  orders jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.indicamed_data enable row level security;

drop policy if exists "users_select_own_indicamed_data" on public.indicamed_data;
create policy "users_select_own_indicamed_data"
on public.indicamed_data for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "users_insert_own_indicamed_data" on public.indicamed_data;
create policy "users_insert_own_indicamed_data"
on public.indicamed_data for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "users_update_own_indicamed_data" on public.indicamed_data;
create policy "users_update_own_indicamed_data"
on public.indicamed_data for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "users_delete_own_indicamed_data" on public.indicamed_data;
create policy "users_delete_own_indicamed_data"
on public.indicamed_data for delete
to authenticated
using (auth.uid() = user_id);
