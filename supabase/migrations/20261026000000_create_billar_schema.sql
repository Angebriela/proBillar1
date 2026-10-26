create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null,
  correo text unique not null,
  created_at timestamptz not null default now()
);

create table public.mesas (
  id uuid primary key default gen_random_uuid(),
  numero integer unique not null,
  tipo text not null,
  estado text not null default 'disponible' check (estado in ('disponible', 'mantenimiento', 'alquilada')),
  tarifa_hora numeric(10,2) not null check (tarifa_hora > 0),
  created_at timestamptz not null default now()
);

create table public.accesorios (
  id uuid primary key default gen_random_uuid(),
  nombre text unique not null,
  cantidad integer not null default 0 check (cantidad >= 0),
  created_at timestamptz not null default now()
);

create table public.mesa_accesorios (
  mesa_id uuid not null references public.mesas(id) on delete restrict,
  accesorio_id uuid not null references public.accesorios(id) on delete restrict,
  cantidad integer not null default 1 check (cantidad > 0),
  primary key (mesa_id, accesorio_id)
);

create table public.alquileres (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete restrict,
  mesa_id uuid not null references public.mesas(id) on delete restrict,
  fecha_inicio timestamptz not null,
  horas integer not null check (horas between 1 and 24),
  estado text not null default 'reservado' check (estado in ('reservado', 'activo', 'finalizado', 'cancelado')),
  created_at timestamptz not null default now()
);

grant select, insert, update on public.clientes, public.mesas, public.accesorios, public.mesa_accesorios, public.alquileres to anon, authenticated;

insert into public.clientes (nombre, telefono, correo) values
  ('Ana López', '5551-1001', 'ana@example.com'),
  ('Carlos Méndez', '5551-1002', 'carlos@example.com'),
  ('María Pérez', '5551-1003', 'maria@example.com');

insert into public.mesas (numero, tipo, estado, tarifa_hora) values
  (1, 'Pool americano', 'disponible', 45.00),
  (2, 'Carambola', 'disponible', 55.00),
  (3, 'Pool profesional', 'mantenimiento', 65.00);

insert into public.accesorios (nombre, cantidad) values
  ('Tacos de repuesto', 8),
  ('Triángulo', 4),
  ('Tiza', 20);

insert into public.mesa_accesorios (mesa_id, accesorio_id, cantidad)
select mesas.id, accesorios.id, datos.cantidad
from (values (1, 'Tacos de repuesto', 2), (1, 'Triángulo', 1), (2, 'Tiza', 4)) as datos(numero, nombre, cantidad)
join public.mesas on mesas.numero = datos.numero
join public.accesorios on accesorios.nombre = datos.nombre;

insert into public.alquileres (cliente_id, mesa_id, fecha_inicio, horas, estado)
select clientes.id, mesas.id, now() + interval '1 day', 2, 'reservado'
from public.clientes, public.mesas
where clientes.correo = 'ana@example.com' and mesas.numero = 1;
