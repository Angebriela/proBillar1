-- Proyecto de práctica: permitir que la Data API lea y escriba las tablas.
-- En producción se deben activar RLS y definir políticas por rol.

alter table public.clientes disable row level security;
alter table public.mesas disable row level security;
alter table public.accesorios disable row level security;
alter table public.mesa_accesorios disable row level security;
alter table public.alquileres disable row level security;

grant select, insert, update on public.clientes, public.mesas, public.accesorios,
  public.mesa_accesorios, public.alquileres to anon, authenticated;
