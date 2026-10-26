# Spec 02: Frontend

## Objetivo en una frase
Construir una interfaz React que consulte las tablas de ProBillar y permita registrar un alquiler seleccionando cliente y mesa desde listas.

## Alcance
Aplicación Vite de una pantalla: indicadores, formulario de alquiler, tabla de alquileres recientes e inventario de mesas, accesorios y relaciones.

## Modelo de datos
El cliente usa `src/lib/supabaseClient.js` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY`. Las consultas leen `clientes`, `mesas`, `accesorios`, `mesa_accesorios` y `alquileres`, incluyendo las relaciones anidadas de Supabase.

## Plan de implementación
1. Crear el cliente de Supabase desde variables públicas de Vite.
2. Cargar las cinco tablas al iniciar la aplicación.
3. Mostrar los registros en indicadores, tabla y listas de inventario.
4. Crear alquileres con `cliente_id` y `mesa_id` elegidos mediante `<select>`.
5. Recargar la agenda después de un alta y mostrar errores de la API.

## Criterios de aceptación
- La aplicación inicia con `npm run dev` y compila con `npm run build`.
- Muestra registros de clientes, mesas y accesorios, además de sus relaciones y alquileres.
- El formulario elige el cliente relacionado por nombre y la mesa por número, sin pedir al usuario ningún UUID.
- El listado de alquileres muestra el nombre del cliente y el número de mesa, no sus IDs.
- Al guardar, el registro aparece en la tabla de alquileres recientes.
- La llave usada por el navegador es publicable y solo llega por variables `VITE_`.

## Decisiones tomadas y descartadas
- Se eligió una vista única para reducir el flujo de reserva.
- Se descartó exponer IDs técnicos en la interfaz.
- Se filtran mesas en mantenimiento del selector para evitar reservas inválidas.
- Se usa `select` anidado en Supabase para mostrar nombres relacionados sin consultas manuales adicionales.
