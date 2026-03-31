-- Migration: Storage Buckets
-- Run this in Supabase SQL Editor to create the public image storage bucket

-- 1. Create a new storage bucket 'public_images'
insert into storage.buckets (id, name, public) 
values ('public_images', 'public_images', true)
on conflict (id) do nothing;

-- 2. Allow public access to view images
create policy "Images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'public_images' );

-- 3. Allow authenticated users to upload images
create policy "Authenticated users can upload images."
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'public_images' );

-- 4. Allow authenticated users to delete/update their own images (or all images for admins)
create policy "Authenticated users can update images."
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'public_images' );

create policy "Authenticated users can delete images."
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'public_images' );
