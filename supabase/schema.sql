-- Supabase schema for Haniya.pk (initial draft)
-- Note: Apply in Supabase SQL editor. RLS and policies to be added next.

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  category_id uuid references categories(id) on delete set null,
  fabric text check (fabric in ('lawn','khaddar','cotton','other')) default 'other',
  price numeric(12,2) not null,
  compare_at_price numeric(12,2),
  currency text not null default 'PKR',
  is_new boolean not null default false,
  is_sale boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_idx on products(category_id);
create index if not exists products_new_idx on products(is_new);
create index if not exists products_sale_idx on products(is_sale);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  sort integer not null default 0
);
create index if not exists product_images_product_idx on product_images(product_id);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  sku text unique,
  size text,
  color text,
  price_override numeric(12,2),
  stock integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_variants_product_idx on product_variants(product_id);

create table if not exists users (
  id uuid primary key,
  email text unique,
  created_at timestamptz not null default now()
);

create table if not exists addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete cascade,
  type text check (type in ('shipping','billing')) not null default 'shipping',
  name text,
  phone text,
  line1 text,
  line2 text,
  city text,
  region text,
  country text default 'PK',
  postal_code text,
  created_at timestamptz not null default now()
);
create index if not exists addresses_user_idx on addresses(user_id);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  status text check (status in ('draft','pending','paid','shipped','delivered','cancelled')) not null default 'pending',
  total numeric(12,2) not null default 0,
  currency text not null default 'PKR',
  payment_status text check (payment_status in ('unpaid','paid','refunded','failed')) not null default 'unpaid',
  shipping_cost numeric(12,2) default 0,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_idx on orders(user_id);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  variant_id uuid references product_variants(id) on delete set null,
  qty integer not null default 1,
  price numeric(12,2) not null,
  currency text not null default 'PKR'
);
create index if not exists order_items_order_idx on order_items(order_id);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  provider text check (provider in ('easypaisa','jazzcash','cod')) not null,
  amount numeric(12,2) not null,
  currency text not null default 'PKR',
  status text check (status in ('initiated','authorized','paid','failed','refunded')) not null default 'initiated',
  reference text,
  created_at timestamptz not null default now()
);
create index if not exists payments_order_idx on payments(order_id);

create table if not exists shipments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  courier text check (courier in ('tcs','leopards','blueex','other')) not null default 'tcs',
  tracking_no text,
  status text check (status in ('pending','in_transit','delivered','returned','cancelled')) not null default 'pending',
  cost numeric(12,2) default 0,
  currency text not null default 'PKR',
  created_at timestamptz not null default now()
);
create index if not exists shipments_order_idx on shipments(order_id);

-- Store order address/contact fields per order
create table if not exists order_addresses (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  name text,
  phone text,
  email text,
  city text,
  line1 text,
  created_at timestamptz not null default now()
);
create index if not exists order_addresses_order_idx on order_addresses(order_id);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid references users(id) on delete set null,
  rating int check (rating between 1 and 5) not null,
  title text,
  content text,
  created_at timestamptz not null default now()
);
create index if not exists reviews_product_idx on reviews(product_id);

-- Storage policies --
create policy "auth can insert product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] = 'product'
);

create policy "public can read product images"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');

