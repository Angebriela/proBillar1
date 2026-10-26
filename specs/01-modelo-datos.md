# Spec 01: Modelo de datos

## Objetivo en una frase
Modelar el préstamo y alquiler de mesas de billar relacionando clientes, mesas, accesorios y reservas.

## Alcance
Crear en Supabase las tablas `clientes`, `mesas`, `accesorios`, `mesa_accesorios` y `alquileres`, con datos de ejemplo suficientes para probar las relaciones desde el frontend.

## Modelo de datos
- `clientes`: `id uuid` PK, `nombre text`, `telefono text`, `correo text unique`, `created_at timestamptz`.
- `mesas`: `id uuid` PK, `numero integer unique`, `tipo text`, `estado text`, `tarifa_hora numeric`, `created_at timestamptz`.
- `accesorios`: `id uuid` PK, `nombre text unique`, `cantidad integer`, `created_at timestamptz`.
- `mesa_accesorios`: PK compuesta (`mesa_id`, `accesorio_id`), FK `mesa_id -> mesas.id`, FK `accesorio_id -> accesorios.id`, `cantidad integer`.
- `alquileres`: `id uuid` PK, FK `cliente_id -> clientes.id`, FK `mesa_id -> mesas.id`, `fecha_inicio timestamptz`, `horas integer`, `estado text`, `created_at timestamptz`.
- La migración concede `select, insert, update` a `anon` y `authenticated` en las cinco tablas para permitir el uso de la Data API.
- RLS queda desactivado en este proyecto de práctica temporal. El proyecto debe eliminarse al terminar el laboratorio.
- Datos iniciales: 3 clientes, 3 mesas, 3 accesorios, 3 relaciones mesa-accesorio y 1 alquiler.

## Plan de implementación
1. Ejecutar `supabase/migrations/20261026000000_create_billar_schema.sql` mediante `mcp__supabase__apply_migration`.
2. Comprobar tablas y relaciones con `mcp__supabase__list_tables`.
3. Consultar datos iniciales con `mcp__supabase__execute_sql`.
4. Mantener las operaciones destructivas bloqueadas por el guardián de base de datos.

## Criterios de aceptación
- Existen las cinco tablas con sus columnas y claves indicadas.
- Existen al menos dos claves foráneas entre tablas.
- `anon` y `authenticated` tienen permisos de Data API.
- Cada tabla tiene datos de ejemplo visibles en Supabase.
- Una consulta de relaciones devuelve el nombre del cliente, el número de mesa y el nombre del accesorio.

## Decisiones tomadas y descartadas
- Se eligió `uuid` para las claves primarias y `gen_random_uuid()` para evitar colisiones.
- Se separó `mesa_accesorios` porque una mesa puede tener muchos accesorios y un accesorio puede estar asociado con varias mesas.
- Se descartó borrar en cascada para clientes y mesas, para proteger el historial de alquileres.
- Se dejó RLS desactivado solo para la práctica temporal. En producción se activaría con políticas por rol.
