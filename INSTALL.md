# Manual de instalación

## Requisitos previos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js 22 (LTS)** o posterior: [https://nodejs.org](https://nodejs.org)
2. **NPM** (incluido con Node.js).
3. **NVM** (opcional, recomendado para desarrollo): [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm)

## Configuración de variables de entorno

Copia el archivo de ejemplo y renómbralo:

```bash
cp .env.sample .env
```

Edita el archivo `.env` con las siguientes variables:

```env
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_SITE_NAME="COMPETENCIA DE ROBOTS SUMO"
NEXT_PUBLIC_BASE_URL="http://localhost:3000/api"
```

* `NEXT_PUBLIC_APP_ENV`: `development`, `test` o `production`.
* `NEXT_PUBLIC_SITE_NAME`: Nombre de la aplicación.
* `NEXT_PUBLIC_BASE_URL`: URL base de tu backend.

## Instalación(Docker)

Inicializa docker compose

```bash
docker compose -f 'docker-compose.yml' up -d --build
```

## Instalación

Desde la raíz del proyecto, instala las dependencias:

```bash
npm install
```

## Ejecución en modo desarrollo

```bash
npm run dev
```

Accede en tu navegador a:

```
http://localhost:8080
```

## Compilación y ejecución en producción

1. Modifica en `.env` a:

   ```env
   NEXT_PUBLIC_APP_ENV=production
   NEXT_PUBLIC_SITE_NAME="Competencia Robots Sumo"
   NEXT_PUBLIC_BASE_URL="https://mi-backend-produccion.com/api"
   ```
2. Compila la aplicación:

   ```bash
   npm run build
   ```
3. Inicia el servidor:

   ```bash
   npm run start
   ```

## Estructura de carpetas

* `app/` – Rutas y páginas de Next.js.
* `components/` – Componentes React reutilizables.
* `lib/api.ts` – Cliente Axios y servicios API.

## Scripts disponibles

* `npm run dev` — Modo desarrollo (hot reload).
* `npm run build` — Compila para producción.
* `npm run start` — Ejecuta en producción.
* `npm run lint` — Corre ESLint.
