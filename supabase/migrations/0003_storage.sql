-- Public bucket for product images. Uploads always go through the service-role
-- client (src/app/actions/upload.ts, after requireAdmin()), so no client-side
-- storage policies are needed for writes — only public read.

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images are publicly readable"
  on storage.objects for select
  using (bucket_id = 'product-images');
