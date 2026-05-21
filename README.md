# Mi Boleta — Monorepo de la Aplicación 🎟️

Este repositorio contiene la solución completa para la plataforma **Mi Boleta**, organizada de manera limpia e independiente en dos proyectos principales: el backend (API) y el frontend (interfaz de usuario).

---

## 📁 Estructura del Monorepo

El repositorio está estructurado de la siguiente forma:

- **[mi-boleta-api/](file:///c:/Users/DANIEL-PC/Mi%20Boleta/mi-boleta-api/)**: Proyecto backend construido con **Node.js, Express, Prisma ORM y PostgreSQL**. Proporciona los servicios RESTful para el manejo de usuarios, autenticación JWT, y las operaciones CRUD de boletas con filtros y paginación.
- **[mi-boleta-frontend/](file:///c:/Users/DANIEL-PC/Mi%20Boleta/mi-boleta-frontend/)**: Aplicación frontend construida con **React, TypeScript, Vite y Vanilla CSS**. Consume de forma centralizada la API, implementando control de accesos por roles, estadísticas en tiempo real en el dashboard, panel de administración interactivo y modo oscuro.

---

## 🚀 Cómo Iniciar el Proyecto

### 1. Iniciar el Backend (API)
Dirígete a la carpeta del backend e instala las dependencias:
```bash
cd mi-boleta-api
npm install
```
Configura tu archivo `.env` basándote en `.env.example`, ejecuta las migraciones de base de datos y arranca el servidor:
```bash
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```
*Por defecto la API correrá en `http://localhost:4000` (o el puerto configurado).*

### 2. Iniciar el Frontend
Dirígete a la carpeta del frontend, instala las dependencias y arranca el servidor en modo desarrollo:
```bash
cd mi-boleta-frontend
npm install
npm run dev
```
*El frontend estará disponible en `http://localhost:5173`. Por defecto, está preconfigurado para consumir la API alojada en producción en Render.*

---

## 📝 Documentación Adicional

- Para ver detalles específicos de las rutas, base de datos y endpoints del backend, consulta el archivo [mi-boleta-api/README.md](file:///c:/Users/DANIEL-PC/Mi%20Boleta/mi-boleta-api/README.md).
- Para ver los componentes visuales, el manejo del tema (dark mode) y los flujos del cliente web, consulta el archivo [mi-boleta-frontend/README.md](file:///c:/Users/DANIEL-PC/Mi%20Boleta/mi-boleta-frontend/README.md).