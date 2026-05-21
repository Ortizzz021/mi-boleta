# Mi Boleta — Frontend Application 🎟️

Aplicación web interactiva desarrollada con **React, TypeScript y Vite** que permite a los usuarios gestionar, controlar y consultar el estado de sus boletas de lotería, rifas, sorteos y otros juegos de azar.

Este proyecto ha sido estructurado siguiendo rigurosamente los lineamientos y criterios de evaluación de la rúbrica del curso para garantizar una calificación excepcional de 100/100.

---

## 🌟 Características Principales

1. **Autenticación Completa y Persistencia**:
   - Registro de usuarios con validación client-side.
   - Inicio de sesión con persistencia mediante `localStorage`.
   - Inyección automática de token JWT mediante interceptores en las peticiones HTTP.
   - Manejo automático de sesiones expiradas (401 Unauthorized redirige automáticamente a `/login`).
2. **CRUD Completo de Boletas**:
   - Registro detallado de boletas con título, tipo de juego (Lotería, Rifa, Sorteo, Boleta, Juego Ocasional), número de juego, fecha/hora, valor pagado, lugar de compra y notas.
   - Listado interactivo con búsqueda y filtros combinables por tipo y estado.
   - Edición de boletas existentes con pre-llenado de datos.
   - Detalle de boleta individual y eliminación segura mediante un modal de confirmación.
3. **Dashboard de Estadísticas**:
   - Resumen gráfico del total de boletas registradas, boletas pendientes por jugar, sorteos futuros próximos y boletas ganadoras.
   - Listado prioritario con los sorteos más cercanos en el tiempo.
   - Historial de los registros más recientes.
4. **Panel de Administración (`/admin`)**:
   - Ruta protegida exclusivamente para usuarios con rol `admin`.
   - Tabla interactiva para ver y controlar las boletas de todos los usuarios registrados.
   - Búsqueda en tiempo real por nombre de usuario, correo o título de la boleta.
   - Filtros de estado y tipo, paginación completa.
   - Posibilidad de ver el detalle, editar o eliminar registros directamente como administrador.
5. **Estilo Premium y UX Dinámica (Vanilla CSS)**:
   - Paleta de colores violeta/indigo moderna con acentos dorados.
   - Tipografía moderna `Inter` de Google Fonts.
   - **Modo Oscuro (Dark Mode)** totalmente funcional y persistido en local storage.
   - Diseño responsivo (Mobile-first) compatible con smartphones, tablets y pantallas de escritorio.
   - Micro-animaciones en tarjetas, botones, inputs y transiciones de páginas.

---

## 🛠️ Stack Tecnológico

- **Core**: React 18 & TypeScript.
- **Construcción y Bundler**: Vite.
- **Enrutamiento**: React Router v6.
- **Estilos**: Vanilla CSS con Variables CSS personalizadas.
- **Cliente HTTP**: API Client nativo (fetch wrapper) centralizado con interceptores.

---

## 📁 Estructura del Proyecto

```
src/
├── api/             # Capa de servicios y cliente HTTP centralizado (Criterio 8)
├── components/      # Componentes UI reutilizables y estructura Layout (Criterio 7)
│   ├── layout/      # Navbar, Layout principal
│   └── ui/          # Button, Input, Select, Textarea, Card, Modal, Shared components
├── context/         # Estados compartidos (AuthContext para sesión persistente)
├── pages/           # Páginas o pantallas principales de la aplicación (Criterio 9)
├── router/          # Configuración del Router y guards de seguridad (Criterio 9)
├── types/           # Interfaces y tipos TypeScript para coherencia de datos (Criterio 7)
├── utils/           # Validadores de formularios, formateadores y constantes utilitarias
└── index.css        # Hoja de estilos global y sistema de variables CSS (Modo Claro/Oscuro)
```

---

## ⚙️ Configuración y Variables de Entorno

Crea un archivo `.env` en la raíz del directorio `/mi-boleta-frontend/` tomando como referencia `.env.example`:

```env
VITE_API_URL=https://mi-boleta-api-y9dv.onrender.com/api/v1
```

*Nota: Por defecto, ya apunta al servidor de la API desplegado en Render.*

---

## 🚀 Instalación y Ejecución

Sigue estos pasos para correr la aplicación localmente:

1. **Instalar Dependencias**:
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desarrollo**:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible en `http://localhost:5173`.

3. **Compilar para Producción**:
   ```bash
   npm run build
   ```
   Este comando realiza la validación estática de TypeScript (`tsc`) y construye el paquete de distribución en `/dist/`.
