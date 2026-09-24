-- Electro Project Items — core schema.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  icon text not null default 'package',
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  category_id uuid not null references categories (id) on delete restrict,
  image_url text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  stock integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on products (category_id);
create index if not exists products_is_active_idx on products (is_active);
create index if not exists products_name_idx on products using gin (to_tsvector('simple', name));

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  address text not null,
  city text,
  state text,
  pincode text,
  notes text,
  items jsonb not null,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  status text not null default 'New'
    check (status in ('New', 'Contacted', 'Confirmed', 'Completed', 'Cancelled')),
  created_at timestamptz not null default now()
);

create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists orders_status_idx on orders (status);

create table if not exists shop_settings (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null default 'Electro Project Items',
  shop_description text not null default '',
  whatsapp_number text not null,
  phone text,
  email text,
  address text,
  logo_url text,
  currency text not null default 'INR',
  updated_at timestamptz not null default now()
);

-- Marks a Supabase Auth user as an admin. Insert rows manually (or via a trusted
-- server script) after creating the user in Supabase Auth — see README.
create table if not exists admin_profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
  before update on products
  for each row execute function set_updated_at();

drop trigger if exists shop_settings_set_updated_at on shop_settings;
create trigger shop_settings_set_updated_at
  before update on shop_settings
  for each row execute function set_updated_at();
