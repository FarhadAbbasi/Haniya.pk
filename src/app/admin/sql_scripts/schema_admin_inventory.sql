-- Admin RBAC
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'admin' check (role in ('admin','editor')),
  created_at timestamptz not null default now()
);

-- Product variants (size/color) and stock
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  color text,
  sku text unique,
  price numeric not null,
  stock integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists idx_product_variants_product on public.product_variants(product_id);

-- Stock movements (auditable)
create table if not exists public.stock_movements (
  id uuid primary key default gen_random_uuid(),
  variant_id uuid not null references public.product_variants(id) on delete cascade,
  delta integer not null,
  reason text not null,
  order_id uuid,
  created_at timestamptz not null default now()
);
create index if not exists idx_stock_movements_variant on public.stock_movements(variant_id);

-- Helper: ensure a single-variant product has at least one row
-- insert into public.product_variants (product_id, size, price, stock)
--   select p.id, 'Default', p.price, 0 from public.products p
--   where not exists (select 1 from public.product_variants v where v.product_id = p.id);



-- Seed variants (S, M, L, XL) for any product missing variants
with base as (
  select p.id as product_id, p.price
  from public.products p
)
insert into public.product_variants (product_id, size, price, stock, is_active)
select b.product_id, s.size, b.price, 0, true
from base b
cross join (values ('S'), ('M'), ('L'), ('XL')) as s(size)
where not exists (
  select 1
  from public.product_variants v
  where v.product_id = b.product_id
);



-- Example: set all S variants to stock 10 (adjust where clause as needed)
update public.product_variants
set stock = 10
where size = 'S';

-- If you want to only initialize products that were zero, you can use:
update public.product_variants
set stock = 3
where size in ('S','M','L','XL') and stock = 0;