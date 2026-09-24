-- Row Level Security — the real authorization boundary. The app's server-side
-- admin checks (src/lib/auth.ts) are a second layer, not a substitute for this.

alter table categories enable row level security;
alter table products enable row level security;
alter table orders enable row level security;
alter table shop_settings enable row level security;
alter table admin_profiles enable row level security;

-- Categories & products: anyone can read; only admins (service role, used from
-- server actions after requireAdmin()) can write.
create policy "categories are publicly readable"
  on categories for select
  using (true);

create policy "products are publicly readable"
  on products for select
  using (true);

-- No insert/update/delete policies for anon/authenticated on categories or
-- products — all writes go through the service-role client from server actions.

-- Shop settings: publicly readable (whatsapp number, shop name, etc. are shown
-- on the storefront), writes are service-role only.
create policy "shop settings are publicly readable"
  on shop_settings for select
  using (true);

-- Orders: no public select/insert policy. Public order creation goes through the
-- service-role client (checkout is a no-login action), and only admins may read
-- or update orders.
create policy "admins can read orders"
  on orders for select
  using (exists (select 1 from admin_profiles where user_id = auth.uid()));

create policy "admins can update orders"
  on orders for update
  using (exists (select 1 from admin_profiles where user_id = auth.uid()));

-- Admin profiles: a signed-in user may check only their own row (used by
-- getAdminSession() to decide whether to show the dashboard).
create policy "users can read their own admin profile"
  on admin_profiles for select
  using (auth.uid() = user_id);
