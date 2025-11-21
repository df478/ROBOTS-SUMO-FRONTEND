# Competencia de Robots Sumo - Frontend

Este repositorio contiene el **frontend** de la "Competencia de Robots Sumo", desarrollado en **Next.js 15** y **React**, consumiendo un backend en NestJS con autenticación JWT.

## Tecnologías utilizadas

* **Next.js 15**: Framework de React para aplicaciones full‑stack.
* **React**: Biblioteca para interfaces de usuario.
* **MUI (Material UI)**: Componentes de UI modernos.
* **React Hook Form** + **Zod**: Validación y gestión de formularios.
* **Axios**: Cliente HTTP con interceptores para JWT.
* **TypeScript**: Tipado estático.

## Características principales

* **Autenticación y autorización** con JWT guardado en cookie.
* **Gestión de participantes, tutores, equipos y rondas** con CRUD completo.
* **Generación automática de rondas** y asignación de equipos.
* **Ingreso y actualización de puntajes** por ronda.
* **Iniciar/detener competencia y rondas** con validaciones de reglas.
* **Vista pública** de resultados (sin autenticación).
* **DataGrid** de MUI para paginación, filtrado, ordenamiento y edición inline.

## Estructura del proyecto

```
/app           # Rutas Next.js (páginas públicas y dashboard)
/components      # Componentes reutilizables
/lib/api.ts      # Cliente Axios y APIs para cada recurso
/middleware.ts   # Middleware para autenticacion
```

## Configuración y puesta en marcha

1. Copia el `.env.example` a `.env`:

   ```bash
   cp .env.example .env
   ```
2. Instala dependencias:

   ```bash
   npm install
   ```
3. Inicia en modo desarrollo:

   ```bash
   npm run dev
   ```
4. Abre `http://localhost:8080` para ver la página pública.

## Scripts disponibles

* `npm run dev` — Ejecuta en desarrollo.
* `npm run build` — Genera carpeta `/.next` para producción.
* `npm run start` — Sirve la versión producción.
* `npm run lint` — Lint con ESLint.

## Integración Docker

* **Dockerfile** y **docker-compose** incluidos para despliegue.

## Convenciones y buenas prácticas

* Hooks: `useState`, `useEffect`, `useForm`.
* Validaciones: formularios con Zod + React Hook Form.
* Axios interceptors para JWT en cookie.
* DataGrid para tablas: inline editing y toolbar.

## Enlaces útiles

* Backend NestJS Base: [https://gitlab.com/.../agetic-nestjs-base-backend](https://gitlab.com/.../agetic-nestjs-base-backend)
* Documentación Next.js: [https://nextjs.org](https://nextjs.org)
* MUI: [https://mui.com](https://mui.com)
* React Hook Form: [https://react-hook-form.com](https://react-hook-form.com)

---
