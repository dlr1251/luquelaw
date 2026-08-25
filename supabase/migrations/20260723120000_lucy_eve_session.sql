-- Torny / Eve session binding on lucy_chats
alter table public.lucy_chats
  add column if not exists eve_session_id text,
  add column if not exists eve_continuation_token text,
  add column if not exists eve_stream_index integer default 0;

create unique index if not exists lucy_chats_eve_session_id_uidx
  on public.lucy_chats (eve_session_id)
  where eve_session_id is not null;

comment on column public.lucy_chats.eve_session_id is 'Vercel Eve durable session id for Torny chat';
comment on column public.lucy_chats.eve_continuation_token is 'Eve continuation token for resume';
comment on column public.lucy_chats.eve_stream_index is 'Last consumed Eve stream index for reconnect';
