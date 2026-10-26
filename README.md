# ProBillar

Aplicación React + Vite para administrar el alquiler de mesas de billar. El modelo incluye clientes, mesas, accesorios, la relación mesa-accesorios y alquileres.

## Puesta en marcha

1. Copia `.env.example` a `.env.local`.
2. Completa `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` con los valores publicables de un proyecto de prueba.
3. Aplica `supabase/migrations/20261026000000_create_billar_schema.sql` desde Supabase o mediante el MCP conectado.
4. Ejecuta `npm install`, `npm run dev`.

La URL de `.mcp.json` contiene un marcador porque el `project_ref` depende de la cuenta de Supabase del estudiante. No se guardan credenciales en Git.
