# Habits App

MVP de una app web de hábitos construida con `Next.js App Router`, `TypeScript`, `Prisma`, `PostgreSQL`, `Tailwind CSS` y `Docker`.

## Qué incluye

- Registro, login y logout con email y contraseña
- Protección de rutas privadas
- CRUD completo de hábitos
- Hábitos tipo `check` y `number`
- Frecuencia diaria o por días concretos de la semana
- Pantalla principal `Hoy` para registrar el progreso diario
- Vista de progreso semanal con cumplimiento y racha básica
- Configuración lista para Docker y despliegue en Coolify

## Stack

- `Next.js 16` con App Router
- `TypeScript`
- `PostgreSQL`
- `Prisma ORM`
- Auth propia con cookie `httpOnly` firmada
- `Tailwind CSS 4`
- `Docker`

## Estructura principal

- `src/app/`: rutas públicas y privadas
- `src/components/`: formularios, layout y componentes de hábitos/progreso
- `src/actions/`: server actions para auth, hábitos y registros diarios
- `src/lib/`: Prisma, auth, validaciones y utilidades
- `prisma/`: esquema de base de datos
- `docker/`: arranque de contenedor

## Requisitos

- `Node.js 24+`
- `npm 11+`
- `PostgreSQL 16+`

## Variables de entorno

Copia `.env.example` a `.env` y ajusta:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/habits_app?schema=public"
AUTH_SECRET="change-this-to-a-long-random-secret-with-at-least-32-characters"
APP_URL="http://localhost:3000"
```

Notas:

- `AUTH_SECRET` debe ser largo, aleatorio y distinto en producción.
- En Coolify, `APP_URL` debe apuntar al dominio final.

## Instalación local

1. Instala dependencias:

```bash
npm install
```

2. Crea tu `.env` a partir del ejemplo.

3. Arranca PostgreSQL.

Opción rápida con Docker Compose:

```bash
cp .env.example .env
docker compose up -d db
```

4. Genera el cliente Prisma y aplica el esquema:

```bash
npm run prisma:generate
npm run prisma:push
```

5. Ejecuta el proyecto:

```bash
npm run dev
```

La app quedará en `http://localhost:3000`.

## Prisma

Comandos útiles:

```bash
npm run prisma:generate
npm run prisma:push
npx prisma studio
```

Modelos principales:

- `User`
- `Habit`
- `HabitEntry`

## Desarrollo

- Landing pública en `/`
- Login en `/login`
- Registro en `/register`
- Panel principal en `/today`
- Gestión de hábitos en `/habits`
- Crear hábito en `/habits/new`
- Editar hábito en `/habits/[id]/edit`
- Progreso en `/progress`

## Producción

Build local:

```bash
npm run build
npm run start
```

## Docker

Construcción:

```bash
docker build -t habits-app .
```

Ejecución:

```bash
docker run --env-file .env -p 3000:3000 habits-app
```

El contenedor ejecuta `prisma migrate deploy` al arrancar y luego levanta Next.js en modo producción.

## Deploy en Coolify

Flujo recomendado:

1. Sube este proyecto a un repositorio GitHub.
2. En Coolify, crea una nueva application desde ese repo usando el `Dockerfile` del root.
3. Adjunta un servicio PostgreSQL gestionado por Coolify o una base externa.
4. Define las variables de entorno:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `APP_URL`
5. Expón el puerto `3000`.
6. Asocia tu dominio o subdominio.

## Estado de la integración con tu Coolify

He localizado en local:

- `COOLIFY_BASE_URL=https://coolify.oabad.com`
- un `COOLIFY_API_TOKEN`
- un `COOLIFY_PROJECT_UUID`

Pero la API responde `401 Unauthenticated` con ese token en `GET /api/v1/version`, así que no he podido crear la application remotamente desde este entorno.

## Roadmap breve

- Recuperación de contraseña
- Filtros por periodos de progreso
- Notas en registros diarios
- Objetivos semanales o mensuales
- Multi-tenant / SaaS features
