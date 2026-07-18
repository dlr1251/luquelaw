-- Lucy RAG v2: pgvector chunks over Immigration norms + CLKR guides.
-- Indexing: npm run index:lucy-rag (AI Gateway embeddings).

create extension if not exists vector with schema extensions;

create table if not exists public.lucy_knowledge_chunks (
  id uuid primary key default gen_random_uuid(),
  source_kind text not null check (source_kind in ('norm', 'guide')),
  source_id uuid not null,
  slug_key text not null,
  locale text not null check (locale in ('en', 'es')),
  title text not null,
  chunk_index int not null default 0 check (chunk_index >= 0),
  content text not null,
  content_hash text not null,
  embedding extensions.vector(1536) not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_kind, source_id, chunk_index, locale)
);

create index if not exists lucy_knowledge_chunks_source_idx
  on public.lucy_knowledge_chunks (source_kind, source_id);

create index if not exists lucy_knowledge_chunks_locale_kind_idx
  on public.lucy_knowledge_chunks (locale, source_kind);

create index if not exists lucy_knowledge_chunks_embedding_hnsw_idx
  on public.lucy_knowledge_chunks
  using hnsw (embedding extensions.vector_cosine_ops);

alter table public.lucy_knowledge_chunks enable row level security;

-- Only published knowledge is indexed; authenticated Lucy users may read.
create policy "lucy_knowledge_chunks_select_authenticated"
  on public.lucy_knowledge_chunks
  for select
  to authenticated
  using (true);

grant select on public.lucy_knowledge_chunks to authenticated;

create or replace function public.match_lucy_knowledge(
  query_embedding extensions.vector(1536),
  match_count int default 6,
  filter_locale text default null,
  filter_kind text default null
)
returns table (
  id uuid,
  source_kind text,
  source_id uuid,
  slug_key text,
  locale text,
  title text,
  content text,
  metadata jsonb,
  similarity float
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    c.id,
    c.source_kind,
    c.source_id,
    c.slug_key,
    c.locale,
    c.title,
    c.content,
    c.metadata,
    (1 - (c.embedding <=> query_embedding))::float as similarity
  from public.lucy_knowledge_chunks c
  where
    (filter_locale is null or c.locale = filter_locale)
    and (filter_kind is null or c.source_kind = filter_kind)
  order by c.embedding <=> query_embedding
  limit greatest(1, least(coalesce(match_count, 6), 24));
$$;

grant execute on function public.match_lucy_knowledge(
  extensions.vector(1536),
  int,
  text,
  text
) to authenticated;

comment on table public.lucy_knowledge_chunks is
  'Embedded chunks for Lucy RAG (Immigration norms + CLKR guides).';
comment on function public.match_lucy_knowledge is
  'Cosine similarity search over lucy_knowledge_chunks for Lucy tool RAG.';
