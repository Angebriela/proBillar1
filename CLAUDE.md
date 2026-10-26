# ProBillar

Aplicación web para gestionar el préstamo y alquiler de mesas de billar, con clientes, mesas, accesorios, relaciones mesa-accesorio y alquileres.

## Comandos

- `npm run dev`: servidor de desarrollo
- `npm run lint`: lint con oxlint
- `npm run build`: compilación de producción

## Reglas del proyecto

- La aplicación usa React + Vite + `@supabase/supabase-js`.
- El navegador solo recibe la URL de Supabase y la llave publicable mediante variables `VITE_`.
- No colocar llaves secretas en el frontend.
- Las migraciones de Supabase viven en `supabase/migrations/`.
