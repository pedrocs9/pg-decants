# PG Decants — Reglas para agentes de desarrollo

## Contexto

PG Decants es un ecommerce chileno de decants de perfumes.
La identidad visual debe sentirse elegante, editorial, moderna y premium.

## Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- PostgreSQL
- Drizzle ORM
- Auth.js
- Vercel

## Reglas generales

- No trabajar directamente en main.
- Inspeccionar el código antes de modificarlo.
- Modificar únicamente archivos relacionados con la tarea.
- No cambiar lógica de negocio durante tareas visuales.
- No modificar base de datos ni migraciones sin autorización expresa.
- No eliminar funcionalidades existentes.
- No agregar dependencias sin justificarlo.
- No utilizar `any` salvo justificación.
- Mantener accesibilidad y diseño responsive.

## Dirección visual

- Mantener la paleta negro, marfil y dorado.
- Conservar una estética sobria y editorial.
- Evitar degradados llamativos.
- Evitar sombras exageradas.
- Evitar bordes redondeados excesivos.
- Evitar animaciones invasivas.
- Evitar apariencia genérica de marketplace.
- Priorizar jerarquía, fotografía, tipografía y espacio.
- Los movimientos deben ser suaves y discretos.

## Diseño responsive

Comprobar como mínimo:

- 375 px
- 768 px
- 1440 px

## Verificación obligatoria

Antes de finalizar una tarea:

1. Ejecutar lint.
2. Ejecutar typecheck, si existe.
3. Ejecutar build.
4. Informar archivos modificados.
5. Informar cualquier riesgo pendiente.
6. No realizar commit ni push sin autorización.