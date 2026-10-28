# Bitácora de uso de IA

Este archivo registra los prompts enviados durante el laboratorio mediante el hook `UserPromptSubmit`.

## 2026-10-26T13:19:14.149Z

Prueba de bitácora

## 2026-10-28T16:01:34.722Z

run /mcp

## Registro retrospectivo de cambios no capturados automáticamente

Las siguientes entradas se agregan de forma retrospectiva para completar la evidencia del laboratorio. El hook `UserPromptSubmit` no estaba activo durante todas estas acciones, por eso no aparecen como registros automáticos.

### 2026-10-26 · Construcción inicial

- Se creó el proyecto React + Vite para ProBillar.
- Se agregó la conexión con Supabase mediante `src/lib/supabaseClient.js`.
- Se definieron las tablas `clientes`, `mesas`, `accesorios`, `mesa_accesorios` y `alquileres`.
- Se crearon las specs `01-modelo-datos.md` y `02-frontend.md`.
- Se agregaron los hooks de Claude Code y los subagentes especializados.

### 2026-10-26 · Modelo de datos

- Se creó la migración inicial con las tablas, llaves foráneas, permisos y datos de ejemplo.
- Se configuró la relación entre clientes, mesas y alquileres.
- Se configuró la relación muchos a muchos entre mesas y accesorios.

### 2026-10-28 · Corrección de conexión

- Se revisó `.env.local` sin registrar ni exponer la llave publicable.
- Se comprobó que la Data API respondía correctamente, pero devolvía listas vacías.
- Se identificó el problema de acceso causado por RLS sin políticas.
- Se creó la migración `20261028000000_fix_billar_data_api_access.sql` para desactivar RLS en este proyecto de práctica y reafirmar los permisos de `anon` y `authenticated`.
- Se verificaron nuevamente `npm run lint` y `npm run build`.
