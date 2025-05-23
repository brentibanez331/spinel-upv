create schema private;

insert into storage.buckets (id, name)
values ('images', 'images')
on conflict do nothing;

create or replace function private.uuid_or_null(str text)
returns uuid
language plpgsql
as $$
begin
  return str::uuid;
  exception when invalid_text_representation then
    return null;
  end;
$$;

create policy "Authenticated users can upload images"
on storage.objects for insert to authenticated with check (
  bucket_id = 'images' and
    owner = auth.uid() and
    private.uuid_or_null(path_tokens[1]) is not null
);

create policy "Users can view their own images"
on storage.objects for select to authenticated using (
  bucket_id = 'images' and owner = auth.uid()
);

create policy "Users can update their own images"
on storage.objects for update to authenticated with check (
  bucket_id = 'images' and owner = auth.uid()
);

create policy "Users can delete their own images"
on storage.objects for delete to authenticated using (
  bucket_id = 'images' and owner = auth.uid()
);